type Role = "member" | "admin" | "owner";

export type User = {
  id: string;
  organizationId: string;
  role: Role;
  username: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  position: string;
  createdAt: Date;
};

export type CreateUserDTO = Omit<User, "id" | "createdAt">;

export type UserDTO = Omit<User, "password">;
