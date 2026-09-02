import bcrypt from "bcryptjs";
import { getDb } from "../database";
import { insertLoginHistory } from "./log";
import type { LoginCredentials } from "../types/auth";
import type { User, UserDTO } from "../types/user";

export const loginUser = (data: LoginCredentials): UserDTO => {
  const db = getDb();

  const user = db.get(
    `SELECT id, organization_id as organizationId,
              role, username, first_name AS firstName, 
              middle_name AS middleName, last_name AS lastName, 
              password, position, created_at AS createdAt 
       FROM users WHERE username = ?`,
    [data.username],
  ) as User | null;

  if (!user) throw new Error("Invalid username or password.");

  const { password, ...userDTO } = user;

  const isMatch = bcrypt.compareSync(data.password, password);

  if (!isMatch) {
    insertLoginHistory(db, user.id, "failed", "Invalid password");
    throw new Error("Invalid username or password.");
  }

  insertLoginHistory(db, user.id, "success");
  return userDTO;
};
