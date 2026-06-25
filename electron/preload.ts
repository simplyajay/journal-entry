import { contextBridge, ipcRenderer } from "electron";
import type { CreateJournalEntryVoucherDTO } from "./db/types/jev";
import type { AuthStoreSchema, IpcResult } from "./ipc/types";
import type { CreateUserDTO, LoginCredentials, UserDTO } from "./db/types/auth";

export type ElectronAPI = {
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;

  createJev: (data: CreateJournalEntryVoucherDTO) => Promise<IpcResult<string>>;

  auth: {
    registerUser: (data: CreateUserDTO) => Promise<IpcResult<string>>;
    getUser: (data: string) => Promise<IpcResult<UserDTO>>;
    login: (data: LoginCredentials) => Promise<IpcResult<UserDTO>>;
  };

  store: {
    setSession: (userId: string) => Promise<IpcResult<void>>;
    getSession: () => Promise<IpcResult<AuthStoreSchema["session"] | null>>;
    clearSession: () => Promise<IpcResult<void>>;
  };
};

contextBridge.exposeInMainWorld("api", {
  minimize: () => ipcRenderer.send("minimize"),
  toggleMaximize: () => ipcRenderer.send("toggle-maximize"),
  close: () => ipcRenderer.send("close"),

  createJev: (data: CreateJournalEntryVoucherDTO) =>
    ipcRenderer.invoke("jev:create", data),

  auth: {
    registerUser: (data: CreateUserDTO) => ipcRenderer.invoke("user:register", data),
    getUser: () => ipcRenderer.invoke("user:get"),
    login: (data: LoginCredentials) => ipcRenderer.invoke("user:login", data),
  },

  store: {
    setSession: (userId: string) => ipcRenderer.invoke("session:set", userId),
    getSession: () => ipcRenderer.invoke("session:get"),
    clearSession: () => ipcRenderer.invoke("session:clear"),
  },
} satisfies ElectronAPI);
