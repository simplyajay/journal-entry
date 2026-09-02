import { ipcMain } from "electron";
import {
  createJev,
  getAvailableJevYears,
  getJevSummariesByOwner,
  searchJevSummariesByOwner,
} from "../../db/repositories/jev";
import type {
  CreateJournalEntryVoucherDTO,
  getJevSummariesByOwnerParams,
  PaginatedJevSummaries,
  PaginationParams,
  searchJevSummariesByOwnerParams,
} from "../../db/types/jev";
import type { IpcResult } from "../types";
import { FieldError } from "../../db/error";

export const registerJevHandlers = (): void => {
  ipcMain.handle(
    "jev:create",
    (_event, data: CreateJournalEntryVoucherDTO): IpcResult<string> => {
      try {
        const { jev, log } = createJev(data);

        return { success: true, data: jev.id };
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
    },
  );

  ipcMain.handle(
    "jev:get-jev-summary",
    (_event, data: getJevSummariesByOwnerParams): IpcResult<PaginatedJevSummaries> => {
      try {
        const jevSummaries = getJevSummariesByOwner(data);

        return { success: true, data: jevSummaries };
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

  ipcMain.handle(
    "jev:search-jev-summary",
    (_event, data: searchJevSummariesByOwnerParams): IpcResult<PaginatedJevSummaries> => {
      try {
        const jevSummaries = searchJevSummariesByOwner(data);

        return { success: true, data: jevSummaries };
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

  ipcMain.handle(
    "jev:get-years",
    (_event, data: { ownerId: string }): IpcResult<number[]> => {
      try {
        const { ownerId } = data;

        const jevYears = getAvailableJevYears(ownerId);

        return { success: true, data: jevYears };
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
