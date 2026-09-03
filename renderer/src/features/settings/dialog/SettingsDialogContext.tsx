import { useReducer } from "react";
import { SettingsDialogContext } from "./useSettingsDialog";
import type { ActionDialogAction, ActionDialogState } from "./useSettingsDialog";

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
