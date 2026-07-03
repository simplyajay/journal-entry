import { ipcMain } from "electron";
import { createOrganization } from "../../db/repositories/organization";
import { FieldError } from "../../db/error";
import type { CreateOriganizationDTO } from "../../db/types/organization";
import type { IpcResult } from "../types";

export const registerOrganizationHandlers = () => {
  ipcMain.handle(
    "organization:create",
    (_event, data: CreateOriganizationDTO): IpcResult<string> => {
      try {
        const organizationId = createOrganization(data);

        return { success: true, data: organizationId };
      } catch (err) {
        if (err instanceof FieldError) {
          return {
            success: false,
            error: { type: "field", message: err.message, field: err.field },
          };
        }
        const message = err instanceof Error ? err.message : String(err);
        return { success: false, error: { type: "general", message: message } };
      }
    },
  );
};
