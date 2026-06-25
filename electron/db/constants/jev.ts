import { DocumentType } from "../types/jev";

export const supportingDocumentsMap: Record<DocumentType, string> = {
  po: "Purchase Order",
  bur: "Budget Utilization Request",
  ris: "Requisition and Issue Slip",
  or: "Official Receipt",
  inv: "Invoice",
  ar: "Acknowledgement Receipt",
  rcd: "Report on Collection and Deposits",
  lr: "Liquidation Report",
};
