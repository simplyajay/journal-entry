import { supportingDocumentsMap } from "../constants/jev";
import { getDb } from "../database";
import {
  JournalEntryVoucher,
  CreateJournalEntryVoucherDTO,
  DocumentEntryDTO,
  CreateJevReturn,
  AuditLogType,
  JournalEntryVoucherSummary,
} from "../types/jev";
import { v7 as uuidv7 } from "uuid";
import type {
  getJevSummariesByOwnerParams,
  PaginatedJevSummaries,
  searchJevSummariesByOwnerParams,
} from "../types/jev";
import { FieldError } from "../error";

const toDateString = (date: Date | undefined): string | null => {
  return date ? date.toISOString() : null;
};

const toCivilDateString = (date: Date | undefined): string | null => {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};
const getDateRange = (year: number, month: number): { start: string; end: string } => {
  if (month === 0) {
    const start = `${year}-01-01`;
    const end = `${year + 1}-01-01`;
    return { start, end };
  }

  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const end = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  return { start, end };
};

export const createJev = (data: CreateJournalEntryVoucherDTO): CreateJevReturn => {
  const db = getDb();
  const jevId = uuidv7();
  const logId = uuidv7();

  db.exec("BEGIN");

  try {
    db.run(
      `INSERT INTO journal_entries (
        id, owner_id, journal_type,
        jev_number, jev_date,
        dv_number, dv_date,
        ada_number, ada_date,
        check_number, check_date,
        payee_name, description,
        created_by, last_updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jevId,
        data.ownerId,
        data.journalType,
        data.journalEntryVoucherNumber,
        toCivilDateString(data.journalEntryVoucherDate),
        data.disbursementVoucherNumber ?? null,
        toCivilDateString(data.disbursementVoucherDate),
        data.debitAuthorityNumber ?? null,
        toCivilDateString(data.debitAuthorityDate),
        data.checkNumber ?? null,
        toCivilDateString(data.checkDate),
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
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
          toCivilDateString(doc.date),
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

    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed: journal_entries.jev_number")
    ) {
      throw new FieldError("JEV number already exists.", "journalEntryVoucherNumber");
    }
    throw err;
  }
};

export const getJevSummariesByOwner = ({
  ownerId,
  pagination,
  filter,
}: getJevSummariesByOwnerParams): PaginatedJevSummaries => {
  const db = getDb();

  const { page, pageSize } = pagination;
  const { year, month } = filter;

  //console.log("page: ", page, " pageSize: ", pageSize);
  //console.log("year: ", year, " month : ", month);

  const { start, end } = getDateRange(year, month);

  const offset = (page - 1) * pageSize;

  const countRow = db.get(
    `SELECT COUNT(*) as count FROM journal_entries 
    WHERE owner_id = ? AND jev_date >= ? AND jev_date < ?`,
    [ownerId, start, end],
  ) as { count: number };

  const total = countRow.count;

  const items = db.all(
    `SELECT id, journal_type as journalType,
    jev_number as journalEntryVoucherNumber,
    jev_date as journalEntryVoucherDate,
    description, created_at as createdAt
    FROM journal_entries
    WHERE owner_id = ?
    AND jev_date >= ?
    AND jev_date < ?
    ORDER BY jev_date DESC, created_at DESC
    LIMIT ? OFFSET ?`,
    [ownerId, start, end, pageSize, offset],
  ) as JournalEntryVoucherSummary[] | [];

  return { items, total, pageSize, page, totalPages: Math.ceil(total / pageSize) };
};

export const searchJevSummariesByOwner = ({
  ownerId,
  keyword,
  pagination,
  dateRange,
}: searchJevSummariesByOwnerParams): PaginatedJevSummaries => {
  const db = getDb();

  const { page, pageSize } = pagination;
  const { from, to } = dateRange;
  const offset = (page - 1) * pageSize;
  const pattern = `%${keyword}%`;

  console.log("ownerId: ", ownerId);
  console.log("keyword: ", pattern);
  console.log("from : ", from);
  console.log("to: ", to);

  const countRow = db.get(
    `SELECT COUNT(*) as count FROM journal_entries
    WHERE owner_id = ?
    AND jev_date >= ? and jev_date <= ?
    AND (jev_number LIKE ? OR description LIKE ?)`,
    [ownerId, from, to, pattern, pattern],
  ) as { count: number };

  const total = countRow.count;

  const items = db.all(
    `SELECT id, journal_type as journalType,
      jev_number as journalEntryVoucherNumber,
      jev_date as journalEntryVoucherDate,
      description, created_at as createdAt
      FROM journal_entries  
      WHERE owner_id = ?
      AND jev_date >= ? AND jev_date <= ?
      AND (jev_number LIKE ? OR description LIKE ?)
      ORDER BY jev_date DESC, created_at DESC
      LIMIT ? OFFSET ?`,
    [ownerId, from, to, pattern, pattern, pageSize, offset],
  ) as JournalEntryVoucherSummary[] | [];

  return { items, total, pageSize, page, totalPages: Math.ceil(total / pageSize) };
};

export const getAvailableJevYears = (ownerId: string): number[] => {
  const db = getDb();

  const rows = db.all(
    `SELECT DISTINCT strftime('%Y', jev_date) AS year
     FROM journal_entries
     WHERE owner_id = ?
     ORDER BY year`,
    [ownerId],
  ) as { year: string }[];

  return rows.map((row) => Number(row.year));
};
