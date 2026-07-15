export type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; error: { type: "field"; message: string; field: string } }
  | { success: false; error: { type: "general"; message: string } };

export type AuthStoreSchema = {
  session: {
    userId: string;
    organizationId: string;
    expiresAt: number;
  } | null;
};
