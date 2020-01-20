/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

import { AzureFunction, Context } from "@azure/functions";
import * as U from "../commons/verify-utils/utils";

const verifyAttachments = (context: Context) =>
  U.verifyAllAttachments(context).map(
    taskEmails => taskEmails.run()
    // only for showing results about data
    // tslint:disable-next-line: no-console
    // .then(emails => emails)
    // tslint:disable-next-line: no-console
    // .catch(e => console.log(e));
  );

async function Main(context: Context): Promise<void> {
  await verifyAttachments(context).run();
}

const verifyAttachmentsActivity: AzureFunction = async (
  context: Context
): Promise<void> => {
  context.log("start activity");
  return await Main(context);
};

export default verifyAttachmentsActivity;
