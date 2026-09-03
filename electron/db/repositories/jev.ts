import { supportingDocumentsMap } from "../constants/jev";
import { getDb } from "../database";
import { v7 as uuidv7 } from "uuid";
import type {
  AccountEntry,
  CivilDate,
  AuditLog,
  CreateJevReturn,
  CreateJournalEntryVoucherDTO,
  getJevByOwnerAndIdParams,
  getJevSummariesByOwnerParams,
  JournalEntryVoucherDetail,
  JournalEntryVoucherSummary,
  PaginatedJevSummaries,
  searchJevSummariesByOwnerParams,
  SupportingDocumentEntry,
} from "../types/jev";
import { FieldError } from "../error";

//  the write path receives real Date objects and stores the civil date
const toCivilDate = (date: Date | undefined): CivilDate | null => {
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
        toCivilDate(data.journalEntryVoucherDate),
        data.disbursementVoucherNumber ?? null,
        toCivilDate(data.disbursementVoucherDate),
        data.debitAuthorityNumber ?? null,
        toCivilDate(data.debitAuthorityDate),
        data.checkNumber ?? null,
        toCivilDate(data.checkDate),
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

    const supportingDocuments = data.supportingDocuments
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
        [entryId, jevId, i, doc.number, doc.type, doc.description, toCivilDate(doc.date)],
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

    const log: AuditLog = {
      id: logId,
      userId: data.createdBy,
      action: "CREATE",
      entityType: "journal_entry",
      entityId: jevId,
      description: `Created journal entry ${data.journalEntryVoucherNumber}`,
      createdAt: new Date().toISOString(),
    };

    return { jevId, log };
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

export const getJevByOwnerAndId = ({
  ownerId,
  jevId,
}: getJevByOwnerAndIdParams): JournalEntryVoucherDetail | null => {
  const db = getDb();

  const row = db.get(
    `SELECT id, owner_id as ownerId, journal_type as journalType,
    jev_number as journalEntryVoucherNumber,
    jev_date as journalEntryVoucherDate,
    dv_number as disbursementVoucherNumber,
    dv_date as disbursementVoucherDate,
    ada_number as debitAuthorityNumber,
    ada_date as debitAuthorityDate,
    check_number as checkNumber,
    check_date as checkDate,
    payee_name as payeeName,
    description,
    created_by as createdBy, created_at as createdAt,
    last_updated_by as lastUpdatedBy, last_updated_at as lastUpdatedAt
    FROM journal_entries
    WHERE id = ? AND owner_id = ?`,
    [jevId, ownerId],
  ) as JournalEntryVoucherDetail | null;

  if (!row) return null;

  const accountingEntries = db.all(
    `SELECT account_code as accountCode, account_name as accountName,
    debit, credit
    FROM accounting_entries
    WHERE journal_entry_id = ?
    ORDER BY sort_order ASC`,
    [jevId],
  ) as AccountEntry[] | [];

  const supportingDocuments = db.all(
    `SELECT document_type as type, document_number as number,
    description, document_date as date
    FROM supporting_documents
    WHERE journal_entry_id = ?
    ORDER BY sort_order ASC`,
    [jevId],
  ) as SupportingDocumentEntry[] | [];

  return { ...row, accountingEntries, supportingDocuments };
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
