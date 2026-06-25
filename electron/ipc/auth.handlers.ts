import { ipcMain } from "electron";
import { IpcResult } from "./types";
import { CreateUserDTO, LoginCredentials, UserDTO } from "../db/types/auth";
import { getUserById, loginUser, registerUser } from "../db/repositories/auth.repository";

export const registerAuthHandlers = (): void => {
  ipcMain.handle("user:register", (_event, data: CreateUserDTO): IpcResult<string> => {
    try {
      const userId = registerUser(data);

      return { success: true, data: userId };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  });

  ipcMain.handle("user:login", (_event, data: LoginCredentials): IpcResult<UserDTO> => {
    try {
      const user = loginUser(data);

      return { success: true, data: user };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  });

  ipcMain.handle("user:get", (_event, data: string): IpcResult<UserDTO> => {
    try {
      const user = getUserById(data);

      return { success: true, data: user };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  });
};
