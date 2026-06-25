import type { LoginSchemaType } from "@/components/form/login/_schema";
import type { JournalEntryVoucherDTO } from "@/components/form/jev/_types";
import type { User } from "@/pages/protected/AuthContext";

type IpcResult<T> = { success: true; data: T } | { success: false; error: string };

interface ElectronAPI {
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
  createJev: (data: JournalEntryVoucherDTO) => Promise<IpcResult<number>>;

  auth: {
    registerUser: (data: CreateUserDTO) => Promise<IpcResult<string>>;
    getUser: (id: string) => Promise<IpcResult<User>>;
    login: (data: LoginCredentials) => Promise<IpcResult<User>>;
  };

  store: {
    setSession: (id: string) => Promise<IpcResult<void>>;
    getSession: () => Promise<
      IpcResult<{
        userId: string;
        expiresAt: number;
      } | null>
    >;
    clearSession: () => Promise<IpcResult<void>>;
  };
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}

export {};
