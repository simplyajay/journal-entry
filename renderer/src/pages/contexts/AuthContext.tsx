import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types/user";
import type { LoginSchemaType } from "@/components/form/login/_schema";

type AuthContextValue = {
  currentUser: User | null;
  login: (data: LoginSchemaType) => Promise<void>;
  logout: () => Promise<void>;
  sessionLoading: boolean;
  loginLoading: boolean;
  loginError?: string;
  setLoginError: (val: string | undefined) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [loginLoading, setLoginLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const session = await window.api.getSession();

        if (!session.success) return;

        if (!session.data) return;

        const result = await window.api.auth.getUser(session.data.userId);

        if (result.success) setCurrentUser(result.data);
      } finally {
        setSessionLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (data: LoginSchemaType) => {
    setLoginLoading(true);
    const result = await window.api.auth.login(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (result.success) {
      setCurrentUser(result.data);
      navigate("/main");
    } else {
      if (result.error.type === "general") {
        setLoginError(result.error.message);
      }
    }
    setLoginLoading(false);
  };

  const logout = async () => {
    const result = await window.api.auth.logout();

    if (result.success) setCurrentUser(null);

    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        sessionLoading,
        loginLoading,
        loginError,
        setLoginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
