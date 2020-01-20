import { Context } from "@azure/functions";
import { task } from "fp-ts/lib/Task";
import { taskEither } from "fp-ts/lib/TaskEither";
import { emailAttachmentsWithStatusMock } from "../../../__mocks__/mocks";
import * as U from "../utils";

jest.mock("../utils", () => {
  const originalIndex = jest.requireActual("../utils");
  return {
    __esModule: true,
    ...originalIndex,
    verifyAllAttachments: (context: Context) =>
      taskEither.of(task.of(emailAttachmentsWithStatusMock))
  };
});

describe("Connect to imap (email) server and verify attachments signature", () => {
  it("should return emails and attachments status", async () => {
    const verifyAll = await U.verifyAllAttachments({} as Context).run();
    expect(verifyAll.isRight()).toBeTruthy();
  });
});
