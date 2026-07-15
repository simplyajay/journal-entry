import bcrypt from "bcryptjs";
import { Database, JSValue } from "node-sqlite3-wasm";
import { getDb } from "../database";
import {
  CreateUserDTO,
  UpdateUserAccountDTO,
  UpdateUserProfileDTO,
  UserDTO,
} from "../types/user";
import { FieldError } from "../error";

interface CreateUser {
  db: Database;
  userId: string;
  userData: CreateUserDTO;
}

export const getUserById = (id: string): UserDTO => {
  const db = getDb();

  const user = db.get(
    `SELECT id, username, first_name AS firstName, 
              middle_name AS middleName, last_name AS lastName, 
              position, created_at AS createdAt 
       FROM users WHERE id = ?`,
    [id],
  ) as UserDTO | null;

  if (!user) throw new Error("User not found.");

  return user;
};

export const createUser = ({ db, userId, userData }: CreateUser) => {
  const { password } = userData;

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (
       id, organization_id, role, username, password, first_name, middle_name, last_name, position
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      userData.organizationId,
      userData.role,
      userData.username,
      hashedPassword,
      userData.firstName,
      userData.middleName ?? null,
      userData.lastName,
      userData.position,
    ],
  );
};

export const updateUserProfile = (id: string, data: UpdateUserProfileDTO): UserDTO => {
  const db = getDb();

  const { firstName, middleName, lastName, position } = data;

  const setClauses: string[] = [];
  const params: JSValue[] = [];

  if (firstName !== undefined && firstName !== "") {
    setClauses.push("first_name = ?");
    params.push(firstName);
  }

  if (middleName !== undefined) {
    setClauses.push("middle_name = ?");
    params.push(middleName);
  }

  if (lastName !== undefined && firstName !== "") {
    setClauses.push("last_name = ?");
    params.push(lastName);
  }

  if (position !== undefined && firstName !== "") {
    setClauses.push("position = ?");
    params.push(position);
  }

  const updatedUser = db.get(
    `UPDATE users SET
    ${setClauses.join(", ")}
    WHERE id = ?
    RETURNING id, organization_id as organizationId, role, username, first_name as firstName,
    middle_name as middleName, last_name as lastName, position, created_at as createdAt`,
    [...params, id],
  ) as UserDTO | null;

  if (!updatedUser) throw new Error("Failed to update user.");

  return updatedUser;
};

export const updateUserAccount = (id: string, data: UpdateUserAccountDTO): UserDTO => {
  const db = getDb();

  const existing = db.get(
    `SELECT id, username, first_name AS firstName, password, 
              middle_name AS middleName, last_name AS lastName, 
              position, created_at AS createdAt 
       FROM users WHERE id = ?`,
    [id],
  ) as (UserDTO & { password: string }) | null;

  if (!existing) throw new Error("User not found");

  const { username, currentPassword, newPassword } = data;

  const isPasswordValid = bcrypt.compareSync(currentPassword, existing.password);

  if (!isPasswordValid) throw new FieldError("Invalid password.", "currentPassword");

  const setClauses: string[] = [];
  const params: JSValue[] = [];

  if (username !== undefined && username !== "") {
    setClauses.push("username = ?");
    params.push(username);
  }

  if (newPassword !== undefined && newPassword !== "") {
    const isOldAndNewPasswordTheSame = bcrypt.compareSync(newPassword, existing.password);

    if (isOldAndNewPasswordTheSame)
      throw new Error("Old and new password should not be the same.");

    setClauses.push("password = ?");

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    params.push(hashedNewPassword);
  }

  if (setClauses.length === 0) {
    const { password, ...rest } = existing;
    return rest;
  }

  db.run(`UPDATE users SET ${setClauses.join(", ")} WHERE id = ?`, [...params, id]);

  const updated = db.get(
    `SELECT id, username, first_name AS firstName, 
            middle_name AS middleName, last_name AS lastName, 
            position, created_at AS createdAt 
       FROM users WHERE id = ?`,
    [id],
  ) as UserDTO | null;

  if (!updated) throw new Error("Failed to update account information.");

  return updated;
};

export const updateUserRole = () => {};
