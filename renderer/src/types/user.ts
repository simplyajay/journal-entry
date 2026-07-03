export type User = {
  id: string;
  organizationId: string;
  role: string;
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  position: string;
  createdAt: Date;
};
