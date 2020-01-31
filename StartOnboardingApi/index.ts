import * as winston from "winston";

import { Context } from "@azure/functions";
import createAzureFunctionHandler from "@pagopa/io-functions-express/dist/src/createAzureFunctionsHandler";
import { secureExpressApp } from "io-functions-commons/dist/src/utils/express";
import { AzureContextTransport } from "io-functions-commons/dist/src/utils/logging";
import { setAppContext } from "io-functions-commons/dist/src/utils/middlewares/context_middleware";

import * as soap from "soap";
import newApp from "../src/app";
import EmailService from "../src/services/emailService";
import { getRequiredEnvVar } from "../src/utils/environment";

// tslint:disable-next-line: no-let
let logger: Context["log"] | undefined;
const contextTransport = new AzureContextTransport(() => logger, {
  level: "debug"
});
winston.add(contextTransport);

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

const init = Promise.all([
  soap.createClientAsync(getRequiredEnvVar("ARSS_WSDL_URL")),
  emailService.verifyTransport()
]).then(([arssClient]) =>
  newApp(emailService, arssClient).then(app => {
    secureExpressApp(app);
    return {
      app,
      // tslint:disable-next-line: no-any
      azureFunctionHandler: createAzureFunctionHandler(app)
    };
  })
);

// Binds the express app to an Azure Function handler
function httpStart(context: Context): void {
  logger = context.log;
  init
    .then(({ app, azureFunctionHandler }) => {
      setAppContext(app, context);
      azureFunctionHandler(context);
    })
    .catch(context.log);
}

export default httpStart;
