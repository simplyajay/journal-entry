import { createContext, useContext } from "react";
import type { User } from "@/types/user";
import type { LoginSchemaType } from "@/features/login/_schema";

export type AuthContextValue = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (data: LoginSchemaType) => Promise<void>;
  logout: () => Promise<void>;
  sessionLoading: boolean;
  loginLoading: boolean;
  loginError?: string;
  setLoginError: (val: string | undefined) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const useCurrentUser = (): User => {
  const { currentUser } = useAuth();
  if (!currentUser)
    throw new Error("useCurrentUser must be used inside a protected route");
  return currentUser;
};
