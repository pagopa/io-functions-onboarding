export interface IMessageAttachment {
  // tslint:disable-next-line: no-any
  data: any;
  filename: string;
  message: string;
  attachmentStatus?: IAttachmentStatus;
}

type AttachmentStatus = "OK" | "ERROR";

export interface IEmailAttachmentStatus {
  messageId: string;
  from: readonly string[];
  to: readonly string[];
  subject: readonly string[];
  date: readonly string[];
  // tslint:disable-next-line: readonly-array
  attachments: IMessageAttachment[];
}

export interface IAttachmentStatus {
  status: AttachmentStatus;
  // tslint:disable-next-line: no-any
  signers?: any;
  operation: string;
}
