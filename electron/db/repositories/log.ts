import { getDb } from "../database";
import { v7 as uuidv7 } from "uuid";
import type { Database } from "node-sqlite3-wasm";
import { LoginHistoryDTO } from "../types/log";

export const insertLoginHistory = (
  db: Database,
  userId: string,
  status: "success" | "failed",
  reason?: string,
) => {
  try {
    db.run(
      `INSERT INTO login_history (id, user_id, status, reason) VALUES (?, ?, ?, ?)`,
      [uuidv7(), userId, status, reason ?? null],
    );
  } catch {}
};

export const getLoginHistory = (userId: string) => {
  const db = getDb();

  return db.all(
    `SELECT id, status, reason, created_at AS createdAt
     FROM login_history WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
  ) as LoginHistoryDTO[] | [];
};
