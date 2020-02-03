import { Config } from "imap";
import { ImapSimpleOptions } from "imap-simple";
import { IEmailAttachmentStatus } from "../../commons/domain/models";

export const emailAttachmentsMock = {
  attachments: [
    {
      data: "base64string in binary format",
      filename: "filename",
      message: "64"
    }
  ],
  date: ["Fri, 06 Dec 2019 22:38:57 +0000"],
  from: ["ente@mail.com"],
  messageId: "64",
  subject: ["Registrazione presso la piattaforma IO"],
  to: ["example@mail.com"]
} as IEmailAttachmentStatus;

const imapConfig = {
  authTimeout: 3000,
  host: "localhost",
  // tslint:disable-next-line: no-hardcoded-credentials
  password: "isittreal",
  port: 111,
  tls: true,
  user: "pippo@pluto.com"
} as Config;

export const imapOptionMock = {
  imap: imapConfig
} as ImapSimpleOptions;

export const emailAttachmentsWithStatusMock = {
  ...emailAttachmentsMock,
  attachments: [
    {
      ...emailAttachmentsMock.attachments[0],
      attachmentStatus: {
        operation: "Verify PDF",
        status: "OK"
      }
    }
  ]
} as IEmailAttachmentStatus;
