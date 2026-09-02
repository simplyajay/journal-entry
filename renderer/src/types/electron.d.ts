import type {
  JournalEntryVoucherDTO,
  PaginatedJevSummaries,
} from "@/components/form/jev/_types";
import type {
  AccountSchemaBaseType,
  ProfileSchemaType,
} from "@/components/form/account/_schema";
import type { User } from "./user";
import type { LoginHistory } from "./log";

export type IpcResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: { type: "field"; message: string; field: string };
    }
  | { success: false; error: { type: "general"; message: string } };

interface WindowHandlers {
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
}

interface AuthHandlers {
  login: (data: LoginCredentials) => Promise<IpcResult<User>>;
  logout: () => Promise<IpcResult<void>>;
}

interface LogHandlers {
  getLoginHistory: (userId: string) => Promise<IpcResult<LoginHistory[]>>;
}

interface OrganizationHandlers {
  getUser: (id: string) => Promise<IpcResult<User>>;
  createOrganization: (
    data: CreateOriganizationDTO,
  ) => Promise<IpcResult<string>>;
}

interface UserHandlers {
  updateUserProfile: (data: ProfileSchemaType) => Promise<IpcResult<User>>;
  updateUserAccount: (data: AccountSchemaBaseType) => Promise<IpcResult<User>>;
}

interface JevHandlers {
  createJev: (data: JournalEntryVoucherDTO) => Promise<IpcResult<number>>;
  getJevSummaries: (data: {
    ownerId: string;
    pagination: { page: number; pageSize: number };
    filter: { year: number; month: number };
  }) => Promise<IpcResult<PaginatedJevSummaries>>;
  searchJevSummaries: (data: {
    ownerId: string;
    keyword: string;
    pagination: { page: number; pageSize: number };
    dateRange: { from: string; to: string };
  }) => Promise<IpcResult<PaginatedJevSummaries>>;
  getJevYears: (data: { ownerId: string }) => Promise<IpcResult<number[]>>;
}

interface ElectronAPI {
  window: WindowHandlers;
  auth: AuthHandlers;
  log: LogHandlers;
  org: OrganizationHandlers;
  user: UserHandlers;
  jev: JevHandlers;

  getSession: () => Promise<
    IpcResult<{
      user: User;
      expiresAt: number;
    } | null>
  >;
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}

export {};
