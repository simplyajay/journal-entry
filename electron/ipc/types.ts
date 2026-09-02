import type { UserDTO } from "../db/types/user";

export type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; error: { type: "field"; message: string; field: string } }
  | { success: false; error: { type: "general"; message: string } };

export type AuthStoreSchema = {
  session: {
    user: UserDTO;
    expiresAt: number;
  } | null;
};
