import { useReducer } from "react";
import { Routine } from "@/lib/types";

type DialogState =
  | { mode: "idle" }
  | { mode: "view"; routine: Routine }
  | { mode: "edit"; routine: Routine }
  | { mode: "create" };

type DialogAction =
  | { type: "OPEN_VIEW"; routine: Routine }
  | { type: "OPEN_EDIT"; routine: Routine }
  | { type: "OPEN_CREATE" }
  | { type: "CLOSE" };

export function dialogReducer(_state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case "OPEN_VIEW":
      return { mode: "view", routine: action.routine };
    case "OPEN_EDIT":
      return { mode: "edit", routine: action.routine };
    case "OPEN_CREATE":
      return { mode: "create" };
    case "CLOSE":
      return { mode: "idle" };
    default:
      return _state;
  }
}

export function useDialog() {
  return useReducer(dialogReducer, { mode: "idle" as const });
}

export type { DialogState, DialogAction };
