export type IpcResult<T> = { success: true; data: T } | { success: false; error: string };

export type AuthStoreSchema = {
  session: {
    userId: string;
    expiresAt: number;
  } | null;
};
