/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 *
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *    function app in Kudu
 */

import * as df from "durable-functions";

// tslint:disable-next-line: typedef
const orchestrator = df.orchestrator(function*(context) {
  return yield context.df.callActivity("VerifyAttachmentsActivity");
});

export default orchestrator;
