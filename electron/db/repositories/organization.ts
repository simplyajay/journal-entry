import bcrypt from "bcryptjs";
import { getDb } from "../database";
import { v7 as uuidv7 } from "uuid";
import { FieldError } from "../error";
import type { CreateOriganizationDTO } from "../types/organization";

export const createOrganization = (data: CreateOriganizationDTO): string => {
  const db = getDb();

  db.exec("BEGIN");

  try {
    const organizationId = uuidv7();
    const userId = uuidv7();
    const hashedPassword = bcrypt.hashSync(data.password, 10);

    db.run(`INSERT INTO organizations (id, owner_id, name) VALUES (?, ?, ?)`, [
      organizationId,
      userId,
      data.organizationName,
    ]);

    db.run(
      `INSERT INTO users (
       id, organization_id, role, username, password, first_name, middle_name, last_name, position
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        organizationId,
        "owner",
        data.username,
        hashedPassword,
        data.firstName,
        data.middleName ?? null,
        data.lastName,
        data.position,
      ],
    );

    db.exec("COMMIT");

    return organizationId;
  } catch (err) {
    db.exec("ROLLBACK");

    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed: organizations.name")
    ) {
      throw new FieldError("Organization name is already taken.", "organizationName");
    }

    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed: users.username")
    ) {
      throw new FieldError("Username is already taken.", "username");
    }
    throw err;
  }
};
