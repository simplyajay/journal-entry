import { getDb } from "../database";
import { v7 as uuidv7 } from "uuid";
import { FieldError } from "../error";
import type { CreateOriganizationDTO } from "../types/organization";
import { createUser } from "./user";
import { CreateUserDTO } from "../types/user";

export const createOrganization = (data: CreateOriganizationDTO): string => {
  const db = getDb();

  db.exec("BEGIN");

  try {
    const organizationId = uuidv7();
    const userId = uuidv7();
    const { organizationName, ...partialUserData } = data;

    const userData: CreateUserDTO = { ...partialUserData, organizationId, role: "owner" };

    db.run(`INSERT INTO organizations (id, owner_id, name) VALUES (?, ?, ?)`, [
      organizationId,
      userId,
      organizationName,
    ]);

    createUser({ db, userId, userData });

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
