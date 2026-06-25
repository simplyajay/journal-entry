import { getDb } from "../database";
import { v7 as uuidv7 } from "uuid";
import { User, UserDTO, CreateUserDTO, LoginCredentials } from "../types/auth";
import bcrypt from "bcryptjs";

export const registerUser = (data: CreateUserDTO): string => {
  const db = getDb();

  db.exec("BEGIN");

  try {
    const existingUser = db.get("SELECT id FROM users WHERE username = ?", [
      data.userName,
    ]) as CreateUserDTO | null;

    if (existingUser) throw new Error("Username is already taken.");

    const userId = uuidv7();
    const hashedPassword = bcrypt.hashSync(data.password, 10);

    db.run(
      `INSERT INTO users (
       id, username, password, first_name, middle_name, last_name, position
       ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.userName,
        hashedPassword,
        data.firstName,
        data.middleName ?? null,
        data.lastName,
        data.position,
      ],
    );

    db.exec("COMMIT");

    return userId;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
};

export const loginUser = (data: LoginCredentials): UserDTO => {
  const db = getDb();

  try {
    const user = db.get(
      `SELECT id, username, first_name AS firstName, 
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
