import Store from "electron-store";
import { ipcMain } from "electron";
import { AuthStoreSchema, IpcResult } from "../types";
import { getUserById, loginUser } from "../../db/repositories/auth";
import type { UserDTO } from "../../db/types/user";
import type { LoginCredentials } from "../../db/types/auth";

export const store = new Store<AuthStoreSchema>();

export const registerAuthHandlers = (): void => {
  ipcMain.handle("user:login", (_event, data: LoginCredentials): IpcResult<UserDTO> => {
    try {
      const user = loginUser(data);

      const ONE_HOUR = 60 * 60 * 1000;

      store.set("session", { userId: user.id, expiresAt: Date.now() + ONE_HOUR });

      return { success: true, data: user };
    } catch (err) {
      return {
        success: false,
        error: {
          type: "general",
          message: err instanceof Error ? err.message : "Unexpected error",
        },
      };
    }
  });

  ipcMain.handle("user:logout", (): IpcResult<void> => {
    try {
      store.delete("session");
      return { success: true, data: undefined };
    } catch (err) {
      return {
        success: false,
        error: {
          type: "general",
          message: err instanceof Error ? err.message : "Unexpected error",
        },
      };
    }
  });

  ipcMain.handle("user:get", (_event, data: string): IpcResult<UserDTO> => {
    try {
      const user = getUserById(data);

      return { success: true, data: user };
    } catch (err) {
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
