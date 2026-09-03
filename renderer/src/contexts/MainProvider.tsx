import { useState } from "react";
import { MainContext } from "./useMain";

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  return (
    <MainContext.Provider value={{ settingsDialogOpen, setSettingsDialogOpen }}>
      {children}
    </MainContext.Provider>
  );
};
