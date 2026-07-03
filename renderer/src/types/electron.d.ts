import type { LoginSchemaType } from "@/components/form/login/_schema";
import type { JournalEntryVoucherDTO } from "@/components/form/jev/_types";
import type { User } from "@/pages/contexts/AuthContext";

export type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; error: { type: "field"; message: string; field: string } }
  | { success: false; error: { type: "general"; message: string } };

interface WindowHandlers {
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
}

interface JevHandlers {
  createJev: (data: JournalEntryVoucherDTO) => Promise<IpcResult<number>>;
}

interface AuthHandlers {
  getUser: (id: string) => Promise<IpcResult<User>>;
  login: (data: LoginCredentials) => Promise<IpcResult<User>>;
  logout: () => Promise<IpcResult<void>>;
}

interface OrganizationHandlers {
  createOrganization: (
    data: CreateOriganizationDTO,
  ) => Promise<IpcResult<string>>;
}

interface ElectronAPI {
  window: WindowHandlers;
  jev: JevHandlers;
  auth: AuthHandlers;
  org: OrganizationHandlers;

  getSession: () => Promise<
    IpcResult<{
      userId: string;
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
