import { createContext, useContext } from "react";

export type MainContextValue = {
  settingsDialogOpen: boolean;
  setSettingsDialogOpen: (val: boolean) => void;
};

export const MainContext = createContext<MainContextValue | undefined>(
  undefined,
);

export const useMain = () => {
  const ctx = useContext(MainContext);
  if (!ctx) throw new Error("useMain must be used within MainProvider");
  return ctx;
};
