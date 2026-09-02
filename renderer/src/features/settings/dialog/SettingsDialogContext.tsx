import { createContext, useContext, useReducer } from "react";

type ActionDialogState = {
  show: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm?: () => void;
};

type ActionDialogAction =
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

const initialState: ActionDialogState = {
  show: false,
  title: "",
  description: "",
};

const actionDialogReducer = (
  state: ActionDialogState,
  action: ActionDialogAction,
): ActionDialogState => {
  switch (action.type) {
    case "open":
      return {
        show: true,
        title: action.payload.title,
        description: action.payload.description,
        confirmLabel: action.payload.confirmLabel,
        onConfirm: action.payload.onConfirm,
      };
    case "close":
      return {
        ...state,
        show: false,
      };

    default:
      return state;
  }
};

type SettingsDialogContextValue = {
  dialog: ActionDialogState;
  action: React.Dispatch<ActionDialogAction>;
};

const SettingsDialogContext = createContext<
  SettingsDialogContextValue | undefined
>(undefined);

export const SettingsDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [actionDialog, dispatch] = useReducer(
    actionDialogReducer,
    initialState,
  );

  return (
    <SettingsDialogContext.Provider
      value={{ dialog: actionDialog, action: dispatch }}
    >
      {children}
    </SettingsDialogContext.Provider>
  );
};

export const useSettingsDialog = () => {
  const ctx = useContext(SettingsDialogContext);
  if (!ctx)
    throw new Error(
      "useSettingsDialog must be used within SettingsDialogContextProvider",
    );
  return ctx;
};
