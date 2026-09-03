import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./useAuth";
import type { LoginSchemaType } from "@/features/login/_schema";
import type { User } from "@/types/user";

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

        setCurrentUser(session.data.user);
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

    if (result.success) {
      setCurrentUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
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
