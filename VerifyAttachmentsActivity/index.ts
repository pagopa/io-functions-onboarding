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
import { Config } from "imap";
import * as Imap from "imap-simple";
import { log } from "../commons/utils/logger";
import * as U from "../commons/verify-utils/utils";

const verifyAttachments = (imapOption: Imap.ImapSimpleOptions) =>
  U.verifyAllAttachments(imapOption).map(taskEmails => taskEmails.run());

async function Main(config: Config): Promise<void> {
  const imapOption: Imap.ImapSimpleOptions = {
    imap: config,
    onmail: (num: number) => log.info("Received %s messages", num)
  };
  await verifyAttachments(imapOption).run();
}

const verifyAttachmentsActivity: AzureFunction = async (
  context: Context
): Promise<void> => {
  context.log("start activity");
  const config = context.bindings.config;
  return await Main(config);
};

export default verifyAttachmentsActivity;
