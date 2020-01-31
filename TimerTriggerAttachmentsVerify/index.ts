import { AzureFunction, Context } from "@azure/functions";
import * as df from "durable-functions";
import { Config } from "imap";
import { getRequiredEnvVar } from "../commons/utils/environment";

const timerTrigger: AzureFunction = async (
  context: Context,
  // tslint:disable-next-line: no-any
  myTimer: any
): Promise<void> => {
  const timeStamp = new Date().toISOString();
  const client = df.getClient(context);

  const config: Config = {
    authTimeout: 3000,
    host: getRequiredEnvVar("IMAP_HOST"),
    password: getRequiredEnvVar("IMAP_PASSWORD"),
    port: Number(getRequiredEnvVar("IMAP_PORT")),
    tls: true,
    user: getRequiredEnvVar("IMAP_MAIL")
  };

  // It resolves a problem at start time.
  // Wait untill the environment is fully loaded
  if (myTimer.IsPastDue) {
    // help at start time
    context.log("Environment not already ready wait ...");
  }

  // name of the orchestrator
  const functionName = "VerifyAttachmentsOrchestrator";
  const instanceId = "timerVerify";
  context.log(
    `Started timer for launching verify orchestrator with ID = '${instanceId}'.`
  );
  await client.startNew(functionName, instanceId, config);
  context.log("Timer verify function ran!", timeStamp);
};

export default timerTrigger;
