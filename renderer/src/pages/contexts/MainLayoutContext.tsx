import { createContext, useContext, useState } from "react";

type MainContextValue = {
  settingsDialogOpen: boolean;
  setSettingsDialogOpen: (val: boolean) => void;
};

const MainContext = createContext<MainContextValue | undefined>(undefined);

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  return (
    <MainContext.Provider value={{ settingsDialogOpen, setSettingsDialogOpen }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMain = () => {
  const ctx = useContext(MainContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
