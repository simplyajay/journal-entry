import { contextBridge, ipcRenderer } from "electron";
import type { CreateJournalEntryVoucherDTO } from "./db/types/jev";
import type { AuthStoreSchema, IpcResult } from "./ipc/types";
import type { LoginCredentials } from "./db/types/auth";
import type { CreateOriganizationDTO } from "./db/types/organization";
import type { UserDTO } from "./db/types/user";
import { LoginHistoryDTO } from "./db/types/log";

type WindowHandlers = {
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
};

type JevHandlers = {
  createJev: (data: CreateJournalEntryVoucherDTO) => Promise<IpcResult<string>>;
};

type LogHandlers = {
  getLoginHistory: (userId: string) => Promise<IpcResult<LoginHistoryDTO[]>>;
};

type AuthHandlers = {
  getUser: (data: string) => Promise<IpcResult<UserDTO>>;
  login: (data: LoginCredentials) => Promise<IpcResult<UserDTO>>;
  logout: () => Promise<IpcResult<void>>;
};

type OrganizationHandlers = {
  createOrganization: (data: CreateOriganizationDTO) => Promise<IpcResult<string>>;
};

export type ElectronAPI = {
  window: WindowHandlers;
  jev: JevHandlers;
  auth: AuthHandlers;
  org: OrganizationHandlers;
  log: LogHandlers;

  getSession: () => Promise<IpcResult<AuthStoreSchema["session"] | null>>;
};

contextBridge.exposeInMainWorld("api", {
  window: {
    minimize: () => ipcRenderer.send("minimize"),
    toggleMaximize: () => ipcRenderer.send("toggle-maximize"),
    close: () => ipcRenderer.send("close"),
  },

  jev: {
    createJev: (data: CreateJournalEntryVoucherDTO) =>
      ipcRenderer.invoke("jev:create", data),
  },

  auth: {
    getUser: (id: string) => ipcRenderer.invoke("user:get", id),
    login: (data: LoginCredentials) => ipcRenderer.invoke("user:login", data),
    logout: () => ipcRenderer.invoke("user:logout"),
  },

  org: {
    createOrganization: (data: CreateOriganizationDTO) =>
      ipcRenderer.invoke("organization:create", data),
  },

  log: {
    getLoginHistory: (userId: string) => ipcRenderer.invoke("login-history:get", userId),
  },

  getSession: () => ipcRenderer.invoke("session:get"),
} satisfies ElectronAPI);
