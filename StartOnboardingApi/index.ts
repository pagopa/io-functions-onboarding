import * as winston from "winston";

import { Context } from "@azure/functions";
import { secureExpressApp } from "io-functions-commons/dist/src/utils/express";
import { AzureContextTransport } from "io-functions-commons/dist/src/utils/logging";
import { setAppContext } from "io-functions-commons/dist/src/utils/middlewares/context_middleware";
import createAzureFunctionHandler from "io-functions-express/dist/src/createAzureFunctionsHandler";

import * as soap from "soap";
import newApp from "../src/app";
import EmailService from "../src/services/emailService";
import { getRequiredEnvVar } from "../src/utils/environment";
import { log } from "../src/utils/logger";

// tslint:disable-next-line: no-let
let logger: Context["log"] | undefined;
const contextTransport = new AzureContextTransport(() => logger, {
  level: "debug"
});
winston.add(contextTransport);

// tslint:disable-next-line: no-console
console.log("************** init func");

const emailService = new EmailService(
  {
    auth: {
      pass: getRequiredEnvVar("EMAIL_PASSWORD"),
      user: getRequiredEnvVar("EMAIL_USER")
    },
    host: getRequiredEnvVar("EMAIL_SMTP_HOST"),
    port: Number(getRequiredEnvVar("EMAIL_SMTP_PORT")),
    secure: getRequiredEnvVar("EMAIL_SMTP_SECURE") === "true"
  },
  {
    from: getRequiredEnvVar("EMAIL_SENDER")
  }
);

// Binds the express app to an Azure Function handler
function httpStart(context: Context): void {
  logger = context.log;
  Promise.all([
    soap.createClientAsync(getRequiredEnvVar("ARSS_WSDL_URL")),
    emailService.verifyTransport()
  ])
    .then(results => {
      const [arssClient] = results;
      return newApp(emailService, arssClient)
        .then(app => {
          secureExpressApp(app);
          setAppContext(app, context);
          createAzureFunctionHandler(app)(context);
        })
        .catch(error => log.error("Error loading app: %s", error));
    })
    .catch(error => {
      log.error("Error on app init. %s", error);
      process.exit(1);
    });
}

export default httpStart;
