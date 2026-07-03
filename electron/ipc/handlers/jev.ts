import { ipcMain } from "electron";
import { createJev } from "../../db/repositories/jev";
import type { CreateJournalEntryVoucherDTO } from "../../db/types/jev";
import type { IpcResult } from "../types";

export const registerJevHandlers = (): void => {
  ipcMain.handle(
    "jev:create",
    (_event, data: CreateJournalEntryVoucherDTO): IpcResult<string> => {
      try {
        const { jev, log } = createJev(data);

        return { success: true, data: jev.id };
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
