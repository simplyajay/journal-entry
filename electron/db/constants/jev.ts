import type { SupportingDocumentType } from "../types/jev";

// renamed: DocumentType -> SupportingDocumentType (C1, one shared name)
export const supportingDocumentsMap: Record<SupportingDocumentType, string> = {
  po: "Purchase Order",
  bur: "Budget Utilization Request",
  ris: "Requisition and Issue Slip",
  or: "Official Receipt",
  inv: "Invoice",
  ar: "Acknowledgement Receipt",
  rcd: "Report on Collection and Deposits",
  lr: "Liquidation Report",
};
