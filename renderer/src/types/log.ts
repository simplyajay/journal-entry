export type LoginHistory = {
  id: string;
  status: "success" | "failed";
  reason?: string;
  createdAt: Date;
};
