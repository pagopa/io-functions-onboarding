import { Config, FetchOptions } from "imap";
import * as Imap from "imap-simple";
import { log } from "../../commons/utils/logger";
import { getRequiredEnvVar } from "../utils/environment";

const config: Config = {
  authTimeout: 3000,
  host: getRequiredEnvVar("IMAP_HOST"),
  password: getRequiredEnvVar("IMAP_PASSWORD"),
  port: Number(getRequiredEnvVar("IMAP_PORT")),
  tls: true,
  user: getRequiredEnvVar("IMAP_MAIL")
};

export const imapOption: Imap.ImapSimpleOptions = {
  imap: config,
  onmail: (num: number) => log.info("Received %s messages", num)
};

// ALL or UNSEEN
export const searchCriteria: readonly string[] = ["UNSEEN"];

export const fetchOptions: FetchOptions = {
  bodies: ["HEADER", "TEXT"],
  markSeen: true,
  struct: true
};

export const urlDemoAruba: string =
  "https://vol.demo.firma-automatica.it/actalisVol/services/VerificationServiceSOAP?wsdl";
