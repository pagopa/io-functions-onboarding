import { task } from "fp-ts/lib/Task";
import {
  emailAttachmentsMock,
  emailAttachmentsWithStatusMock
} from "../../../__mocks__/mocks";
import { urlDemoAruba } from "../../domain/data";
import { IEmailAttachmentStatus } from "../../domain/models";
import * as ArubaVerify from "../wsaruba";

jest.mock("../../verify-sign/wsaruba", () => {
  const originalWsAruba = jest.requireActual("../../verify-sign/wsaruba");
  return {
    __esModule: true,
    ...originalWsAruba,
    verify: jest.fn((_: IEmailAttachmentStatus) =>
      task.of(emailAttachmentsWithStatusMock)
    )
  };
});

jest.mock("soap", () => {
  const originalSoapModule = jest.requireActual("soap");
  return {
    __esModule: true,
    ...originalSoapModule,
    createClientAsync: jest.fn((_: string) => Promise.resolve({}))
  };
});

describe("Connect to a wsdl Aruba Client and verify signature ", () => {
  it("should connect to an imap server with the right credentials", async () => {
    const wsFunc = await ArubaVerify.createClientAruba(urlDemoAruba).run();
    expect(wsFunc.isRight()).toBeTruthy();
  });

  it("it should verify the attachment has signature ", async () => {
    const verify = await ArubaVerify.verify(emailAttachmentsMock).run();
    expect(verify).toBeDefined();
    expect(verify).not.toBe(emailAttachmentsMock);
  });
});
