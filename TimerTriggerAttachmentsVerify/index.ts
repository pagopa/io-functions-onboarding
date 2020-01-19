import { AzureFunction, Context } from "@azure/functions";
import * as df from "durable-functions";

const timerTrigger: AzureFunction = async (
  context: Context,
  // tslint:disable-next-line: no-any
  myTimer: any
): Promise<void> => {
  const timeStamp = new Date().toISOString();
  const client = df.getClient(context);

  if (myTimer.IsPastDue) {
    // help at start time
    context.log("Timer function is running late!");
  }

  // name of the orchestrator
  const functionName = "VerifyAttachmentsOrchestrator";
  const instanceId = "timerVerify";
  context.log(
    `Started timer for launching verify orchestrator with ID = '${instanceId}'.`
  );
  await client.startNew(functionName, instanceId);
  context.log("Timer verify function ran!", timeStamp);
};

export default timerTrigger;
