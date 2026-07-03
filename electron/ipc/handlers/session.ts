import { store } from "./auth";
import { ipcMain } from "electron";
import type { AuthStoreSchema, IpcResult } from "../types";

export const registerStoreHandlers = (): void => {
  ipcMain.handle("session:get", (): IpcResult<AuthStoreSchema["session"]> => {
    try {
      const session = store.get("session");

      if (!session) return { success: true, data: null };

      if (Date.now() > session.expiresAt) {
        store.delete("session");

        return { success: true, data: null };
      }

      return { success: true, data: session };
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

  ipcMain.handle("session:clear", (): IpcResult<void> => {
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
};
