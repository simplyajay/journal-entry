import { ipcMain } from "electron";
import type { IpcResult } from "../types";
import type { LoginHistoryDTO } from "../../db/types/log";
import { getLoginHistory } from "../../db/repositories/log";

export const registerLogHandlers = (): void => {
  ipcMain.handle(
    "login-history:get",
    (_event, data: string): IpcResult<LoginHistoryDTO[]> => {
      try {
        const loginHistory = getLoginHistory(data);

        return { success: true, data: loginHistory };
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
};
