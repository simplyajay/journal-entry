export type LoginHistory = {
  id: string;
  userId: string;
  status: "success" | "failed";
  reason?: string;
  createdAt: Date;
};

export type LoginHistoryDTO = Omit<LoginHistory, "userId">;
