import { supportingDocumentsMap } from "../constants/jev";
import { getDb } from "../database";
import {
  JournalEntryVoucher,
  CreateJournalEntryVoucherDTO,
  DocumentEntryDTO,
  CreateJevReturn,
  AuditLogType,
} from "../types/jev";
import { v7 as uuidv7 } from "uuid";

const toDateString = (date: Date | undefined): string | null => {
  return date ? date.toISOString() : null;
};

export const createJev = (data: CreateJournalEntryVoucherDTO): CreateJevReturn => {
  const db = getDb();
  const jevId = uuidv7();
  const logId = uuidv7();

  db.exec("BEGIN");

  try {
    db.run(
      `INSERT INTO journal_entries (
        id, journal_type,
        jev_number, jev_date,
        dv_number, dv_date,
        ada_number, ada_date,
        check_number, check_date,
        payee_name, description,
        created_by, last_updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jevId,
        data.journalEntryVoucherNumber,
        toDateString(data.journalEntryVoucherDate),
        data.journalType,
        data.disbursementVoucherNumber ?? null,
        toDateString(data.disbursementVoucherDate),
        data.debitAuthorityNumber ?? null,
        toDateString(data.debitAuthorityDate),
        data.checkNumber ?? null,
        toDateString(data.checkDate),
        data.payeeName ?? null,
        data.description,
        data.createdBy,
        data.createdBy,
      ],
    );

    for (let i = 0; i < data.accountingEntries.length; i++) {
      const entry = data.accountingEntries[i];
      const entryId = uuidv7();

      db.run(
        `INSERT INTO accounting_entries (
          id,
          journal_entry_id, sort_order,
          account_code, account_name,
          debit, credit
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          entryId,
          jevId,
          i,
          entry.accountCode,
          entry.accountName,
          entry.debit ?? null,
          entry.credit ?? null,
        ],
      );
    }

    //insert description
    const supportingDocuments: DocumentEntryDTO[] = data.supportingDocuments
      ? data.supportingDocuments.map((doc) => ({
          ...doc,
          description: supportingDocumentsMap[doc.type],
        }))
      : [];

    for (let i = 0; i < supportingDocuments.length; i++) {
      const doc = supportingDocuments[i];
      const entryId = uuidv7();

      db.run(
        `INSERT INTO supporting_documents (
          id, journal_entry_id, sort_order,
          document_number, document_type, description, document_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          entryId,
          jevId,
          i,
          doc.number,
          doc.type,
          doc.description,
          toDateString(doc.date),
        ],
      );
    }

    db.run(
      `INSERT INTO audit_log (
        id, user_id, action, entity_type, entity_id, description
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        logId,
        data.createdBy,
        "CREATE",
        "journal_entry",
        jevId,
        `Created journal entry ${data.journalEntryVoucherNumber}`,
      ],
    );

    db.exec("COMMIT");

    const jev: JournalEntryVoucher = { ...data, id: jevId, supportingDocuments };
    const log: AuditLogType = {
      id: logId,
      userId: data.createdBy,
      action: "CREATE",
      entityType: "journal_entry",
      entityId: jevId,
      description: `Created journal entry ${data.journalEntryVoucherNumber}`,
      createdAt: new Date(Date.now()),
    };

    return { jev, log };
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
};
