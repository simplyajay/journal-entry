import type {
  CreateJournalEntryVoucherDTO,
  getJevByOwnerAndIdParams,
  getJevSummariesByOwnerParams,
  JournalEntryVoucherDetail,
  PaginatedJevSummaries,
  searchJevSummariesByOwnerParams,
} from "@shared/types/jev";

import type {
  AccountSchemaBaseType,
  ProfileSchemaType,
} from "@/features/settings/tabs/account/_schema";
import type { User } from "./user";
import type { LoginHistory } from "./log";
import type { LoginSchemaType } from "@/features/login/_schema";
import type { SetupSchemaType } from "@/features/setup/_schema";

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
  login: (data: LoginSchemaType) => Promise<IpcResult<User>>;
  logout: () => Promise<IpcResult<void>>;
}

interface LogHandlers {
  getLoginHistory: (userId: string) => Promise<IpcResult<LoginHistory[]>>;
}

interface OrganizationHandlers {
  getUser: (id: string) => Promise<IpcResult<User>>;
  createOrganization: (data: SetupSchemaType) => Promise<IpcResult<string>>;
}

interface UserHandlers {
  updateUserProfile: (data: ProfileSchemaType) => Promise<IpcResult<User>>;
  updateUserAccount: (data: AccountSchemaBaseType) => Promise<IpcResult<User>>;
}

interface JevHandlers {
  createJev: (data: CreateJournalEntryVoucherDTO) => Promise<IpcResult<string>>;
  getJevSummaries: (
    data: getJevSummariesByOwnerParams,
  ) => Promise<IpcResult<PaginatedJevSummaries>>;
  searchJevSummaries: (
    data: searchJevSummariesByOwnerParams,
  ) => Promise<IpcResult<PaginatedJevSummaries>>;
  getJev: (
    data: getJevByOwnerAndIdParams,
  ) => Promise<IpcResult<JournalEntryVoucherDetail | null>>;
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
