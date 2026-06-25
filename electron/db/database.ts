import { Database } from "node-sqlite3-wasm";
import { app } from "electron";
import bcrypt from "bcryptjs";
import path from "path";

let db: Database | null = null;

export const getDb = (): Database => {
  if (!db) {
    throw new Error(
      "Database has not been initialized. Call initializeDatabase() first.",
    );
  }
  return db;
};

export const initializeDatabase = (): void => {
  const dbPath = path.join(app.getPath("userData"), "jev.db");
  console.log(`[DB] Opening database at: ${dbPath}`);

  db = new Database(dbPath);
  db.exec("PRAGMA foreign_keys = ON");
  console.log("[DB] Foreign keys enabled");

  createTables();
  seedAdmin();

  console.log("[DB] Initialization complete");
};

const createTables = (): void => {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS users (
      id           TEXT    PRIMARY KEY,
      username     TEXT    NOT NULL UNIQUE,
      password     TEXT    NOT NULL,
      first_name   TEXT    NOT NULL,
      middle_name  TEXT,
      last_name    TEXT    NOT NULL,
      position     TEXT    NOT NULL,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id              TEXT PRIMARY KEY,
      journal_type    TEXT NOT NULL,
      jev_number      TEXT NOT NULL UNIQUE,
      jev_date        TEXT NOT NULL,
      dv_number       TEXT,
      dv_date         TEXT,
      ada_number      TEXT UNIQUE,
      ada_date        TEXT,
      check_number    TEXT UNIQUE,
      check_date      TEXT,
      payee_name      TEXT,
      description     TEXT,
      created_by      TEXT NOT NULL REFERENCES users(id),
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      last_updated_by TEXT NOT NULL REFERENCES users(id),
      last_updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS accounting_entries (
      id                TEXT PRIMARY KEY,
      journal_entry_id  TEXT NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
      sort_order        INTEGER NOT NULL,
      account_code      TEXT    NOT NULL,
      account_name      TEXT    NOT NULL,
      debit             REAL,
      credit            REAL
    );

    CREATE TABLE IF NOT EXISTS supporting_documents (
      id                TEXT PRIMARY KEY,
      journal_entry_id  TEXT NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
      sort_order        INTEGER NOT NULL,
      document_number   TEXT,
      document_type     TEXT,
      description       TEXT,
      document_date     TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id          TEXT PRIMARY KEY,
      user_id     TEXT REFERENCES users(id),
      action      TEXT NOT NULL,
      entity_type TEXT,
      entity_id   INTEGER,
      description TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  console.log("[DB] Tables created (or already exist)");
};

const seedAdmin = (): void => {
  const row = getDb().get("SELECT COUNT(*) as count FROM users") as {
    count: number;
  };

  if (row.count > 0) {
    console.log("[DB] Seed skipped — users table already has data");
    return;
  }

  const adminPassword = bcrypt.hashSync("admin", 10);

  getDb().run(
    "INSERT INTO users (username, password, first_name, last_name, position) VALUES (?, ?, ?, ?, ?)",
    ["admin", adminPassword, "admin", "admin", "administrator"],
  );

  console.log("[DB] Default admin user seeded (plaintext — replace before production)");
};
