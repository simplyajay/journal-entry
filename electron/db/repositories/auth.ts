import bcrypt from "bcryptjs";
import { getDb } from "../database";
import type { LoginCredentials } from "../types/auth";
import type { User, UserDTO } from "../types/user";

export const loginUser = (data: LoginCredentials): UserDTO => {
  const db = getDb();

  try {
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

    if (!isMatch) throw new Error("Invalid username or password.");

    return userDTO;
  } catch (err) {
    throw err;
  }
};

export const getUserById = (id: string): UserDTO => {
  const db = getDb();

  try {
    const user = db.get(
      `SELECT id, username, first_name AS firstName, 
              middle_name AS middleName, last_name AS lastName, 
              position, created_at AS createdAt 
       FROM users WHERE id = ?`,
      [id],
    ) as UserDTO | null;

    if (!user) throw new Error("User not found.");

    return user;
  } catch (err) {
    throw err;
  }
};
