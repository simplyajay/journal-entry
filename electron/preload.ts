import { contextBridge, ipcRenderer } from "electron";
import type { CreateJournalEntryVoucherDTO } from "./db/types/jev";
import type { AuthStoreSchema, IpcResult } from "./ipc/types";
import type { LoginCredentials } from "./db/types/auth";
import type { CreateOriganizationDTO } from "./db/types/organization";
import type {
  UpdateUserAccountDTO,
  UpdateUserProfileDTO,
  UserDTO,
} from "./db/types/user";
import { LoginHistoryDTO } from "./db/types/log";

type WindowHandlers = {
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
};

type AuthHandlers = {
  login: (data: LoginCredentials) => Promise<IpcResult<UserDTO>>;
  logout: () => Promise<IpcResult<void>>;
};

type LogHandlers = {
  getLoginHistory: (userId: string) => Promise<IpcResult<LoginHistoryDTO[]>>;
};

type OrganizationHandlers = {
  createOrganization: (data: CreateOriganizationDTO) => Promise<IpcResult<string>>;
  getUser: (data: string) => Promise<IpcResult<UserDTO>>;
};

type UserHandlers = {
  updateUserProfile: (data: UpdateUserProfileDTO) => Promise<IpcResult<UserDTO>>;
  updateUserAccount: (data: UpdateUserAccountDTO) => Promise<IpcResult<UserDTO>>;
};

type JevHandlers = {
  createJev: (data: CreateJournalEntryVoucherDTO) => Promise<IpcResult<string>>;
};

export type ElectronAPI = {
  window: WindowHandlers;
  auth: AuthHandlers;
  log: LogHandlers;
  org: OrganizationHandlers;
  user: UserHandlers;
  jev: JevHandlers;

  getSession: () => Promise<IpcResult<AuthStoreSchema["session"] | null>>;
};

contextBridge.exposeInMainWorld("api", {
  window: {
    minimize: () => ipcRenderer.send("minimize"),
    toggleMaximize: () => ipcRenderer.send("toggle-maximize"),
    close: () => ipcRenderer.send("close"),
  },

  auth: {
    login: (data: LoginCredentials) => ipcRenderer.invoke("login", data),
    logout: () => ipcRenderer.invoke("logout"),
  },

  log: {
    getLoginHistory: (userId: string) => ipcRenderer.invoke("login-history:get", userId),
  },

  org: {
    getUser: (id: string) => ipcRenderer.invoke("user:get", id),
    createOrganization: (data: CreateOriganizationDTO) =>
      ipcRenderer.invoke("organization:create", data),
  },

  user: {
    updateUserProfile: (data: UpdateUserProfileDTO) =>
      ipcRenderer.invoke("user:update-profile", data),
    updateUserAccount: (data: UpdateUserAccountDTO) =>
      ipcRenderer.invoke("user:update-account", data),
  },

  jev: {
    createJev: (data: CreateJournalEntryVoucherDTO) =>
      ipcRenderer.invoke("jev:create", data),
  },

  getSession: () => ipcRenderer.invoke("session:get"),
} satisfies ElectronAPI);
