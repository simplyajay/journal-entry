import { v7 as uuidv7 } from "uuid";
import type { Database } from "node-sqlite3-wasm";

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
