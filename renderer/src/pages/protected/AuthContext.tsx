import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  userName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  position: string;
  createdAt: Date;
};

type AuthContextValue = {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const session = await window.api.store.getSession();

      if (!session.success) return;

      if (!session.data) return;

      const result = await window.api.auth.getUser(session.data.userId);

      if (result.success) setCurrentUser(result.data);
    };

    bootstrap();
  }, []);

  const login = (user: User) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
