import { createContext, useContext } from "react";

export type ActionDialogState = {
  show: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm?: () => void;
};

export type ActionDialogAction =
  | {
      type: "open";
      payload: {
        title: string;
        description: string;
        confirmLabel?: string;
        onConfirm?: () => void;
      };
    }
  | { type: "close" };

export type SettingsDialogContextValue = {
  dialog: ActionDialogState;
  action: React.Dispatch<ActionDialogAction>;
};

export const SettingsDialogContext = createContext<
  SettingsDialogContextValue | undefined
>(undefined);

export const useSettingsDialog = () => {
  const ctx = useContext(SettingsDialogContext);
  if (!ctx)
    throw new Error(
      "useSettingsDialog must be used within SettingsDialogProvider",
    );
  return ctx;
};
