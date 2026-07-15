import { ipcMain } from "electron";
import { IpcResult } from "../types";
import { updateUserAccount, updateUserProfile } from "../../db/repositories/user";
import { store } from "./auth";
import type {
  UpdateUserAccountDTO,
  UpdateUserProfileDTO,
  UserDTO,
} from "../../db/types/user";
import { FieldError } from "../../db/error";

export const registerUserHandlers = () => {
  ipcMain.handle(
    "user:update-profile",
    (_event, data: UpdateUserProfileDTO): IpcResult<UserDTO> => {
      try {
        const session = store.get("session");

        if (!session || Date.now() > session.expiresAt) {
          return { success: false, error: { type: "general", message: "Unauthorized." } };
        }

        const updatedUser = updateUserProfile(session.userId, data);

        return { success: true, data: updatedUser };
      } catch (err) {
        return {
          success: false,
          error: {
            type: "general",
            message: err instanceof Error ? err.message : "Unexpected error",
          },
        };
      }
    },
  );

  ipcMain.handle("user:update-account", (_event, data: UpdateUserAccountDTO) => {
    try {
      const session = store.get("session");

      if (!session || Date.now() > session.expiresAt) {
        return { success: false, error: { type: "general", message: "Unauthorized." } };
      }

      const updatedUser = updateUserAccount(session.userId, data);

      return { success: true, data: updatedUser };
    } catch (err) {
      if (err instanceof FieldError) {
        return {
          success: false,
          error: { type: "field", message: err.message, field: err.field },
        };
      }
      return {
        success: false,
        error: {
          type: "general",
          message: err instanceof Error ? err.message : "Unexpected error",
        },
      };
    }
  });
};
