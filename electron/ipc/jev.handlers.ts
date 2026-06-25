import { ipcMain } from "electron";
import { createJev } from "../db/repositories/jev.repository";
import { CreateJournalEntryVoucherDTO } from "../db/types/jev";
import type { IpcResult } from "./types";

export const registerJevHandlers = (): void => {
  ipcMain.handle(
    "jev:create",
    (_event, data: CreateJournalEntryVoucherDTO): IpcResult<string> => {
      try {
        const { jev, log } = createJev(data);

        return { success: true, data: jev.id };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { success: false, error: message };
      }
    },
  );
};
