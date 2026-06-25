import Store from "electron-store";
import { ipcMain } from "electron";
import type { AuthStoreSchema, IpcResult } from "./types";

export const store = new Store<AuthStoreSchema>();

export const setSession = (userId: string) => {
  const ONE_HOUR = 60 * 60 * 1000;

  store.set("session", { userId, expiresAt: Date.now() + ONE_HOUR });
};

export const registerStoreHandlers = (): void => {
  ipcMain.handle("session:set", (_event, userId: string): IpcResult<void> => {
    try {
      setSession(userId);

      return { success: true, data: undefined };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  });

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
        error: err instanceof Error ? err.message : "Unknown error",
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
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  });
};
