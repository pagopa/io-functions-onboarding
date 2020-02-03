import { AzureFunction, Context } from "@azure/functions";
import * as df from "durable-functions";

const timerTrigger: AzureFunction = async (
  context: Context,
  // tslint:disable-next-line: no-any
  myTimer: any
): Promise<void> => {
  const timeStamp = new Date().toISOString();
  const client = df.getClient(context);

  // It resolves a random problem at start time:
  // the timer trigger did not start sometimes due
  // to some indeterministic behaviour.
  // Wait untill the environment is fully loaded
  if (myTimer.IsPastDue) {
    // help at start time
    context.log("Environment not ready yet, wait ...");
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
