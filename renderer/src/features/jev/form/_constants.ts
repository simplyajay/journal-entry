import type { JournalType, SupportingDocumentType } from "./_types";

export const journalTypeMap: Record<JournalType, string> = {
  ckdj: "[CKDJ] Check Disbursement Journal",
  cdj: "[CDJ] Cash Disbursement Journal",
  crj: "[CRJ] Cash Receipts Journal",
  msij: "[MSIJ] Materials and Supplies Issuance Journal",
  gj: "[GJ] General Journal",
};

export const supportingDocumentsMap: Record<SupportingDocumentType, string> = {
  po: "[PO] Purchase Order",
  bur: "[BUR] Budget Utilization Request",
  ris: "[RIS] Requisition and Issue Slip",
  or: "[OR] Official Receipt",
  inv: "Invoice",
  ar: "[AR] Acknowledgement Receipt",
  rcd: "[RCD] Report on Collection and Deposits",
  lr: "[LR] Liquidation Report",
};

export const allowedSupportingDocumentsMap: Record<
  JournalType,
  SupportingDocumentType[]
> = {
  ckdj: ["po", "bur", "or", "inv", "ar"],
  cdj: ["bur"],
  crj: ["rcd"],
  msij: ["ris"],
  gj: ["lr"],
};
