import { FetchOptions } from "imap";

// ALL or UNSEEN
export const searchCriteria: readonly string[] = ["UNSEEN"];

export const fetchOptions: FetchOptions = {
  bodies: ["HEADER", "TEXT"],
  markSeen: true,
  struct: true
};

export const urlDemoAruba: string =
  "https://vol.demo.firma-automatica.it/actalisVol/services/VerificationServiceSOAP?wsdl";
