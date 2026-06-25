export type User = {
  id: string;
  userName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  position: string;
  password: string;
  createdAt: Date;
};

export type CreateUserDTO = Omit<User, "id" | "createdAt">;

export type UserDTO = Omit<User, "password">;

export type LoginCredentials = {
  username: string;
  password: string;
};
