"use client";

import { deleteRoutine } from "@/app/actions";
import RoutineCard from "@/components/routine/routine-card";
import RoutineDialog from "@/components/routine/routine-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Routine } from "@/lib/types";
import confetti from "canvas-confetti";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useOptimistic,
  useReducer,
  useRef,
  useTransition,
} from "react";
import CreateRoutineDialog from "../routine/create-routine-dialog";
import EditRoutineDialog from "../routine/edit-routine-dialog";

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

function dialogReducer(_state: DialogState, action: DialogAction): DialogState {
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

export default function HomePresentation({
  routines,
}: {
  routines: Routine[];
}) {
  const router = useRouter();
  const [dialog, dispatch] = useReducer(dialogReducer, { mode: "idle" });
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [, startTransition] = useTransition();
  const [optimisticRoutines, optimisticDeleteRoutine] = useOptimistic(
    routines,
    (state, routineId: string) => state.filter((r) => r.id !== routineId),
  );

  const { execute: deleteAction } = useAction(deleteRoutine, {
    onError: () => {
      startTransition(() => router.refresh());
    },
  });

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) return;
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      dispatch({ type: "CLOSE" });
    },
    [dispatch, closeTimerRef],
  );

  const onCompleteRoutine = useCallback(() => {
    confetti({
      particleCount: 100,
      startVelocity: 25,
      spread: 360,
    });
    closeTimerRef.current = setTimeout(() => {
      dispatch({ type: "CLOSE" });
    }, 2500);
  }, [dispatch, closeTimerRef]);

  const onPrevRoutine = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, [closeTimerRef]);

  return (
    <>
      {optimisticRoutines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground text-lg">
            まだルーティンがありません
          </p>
          <p className="text-muted-foreground text-sm">
            右下の＋ボタンから作成しましょう
          </p>
        </div>
      ) : (
        <Dialog open={dialog.mode === "view"} onOpenChange={onOpenChange}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {optimisticRoutines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onEdit={() => dispatch({ type: "OPEN_EDIT", routine })}
                onDelete={() => {
                  if (confirm("このルーティンを削除しますか？")) {
                    startTransition(() => {
                      optimisticDeleteRoutine(routine.id);
                      deleteAction({ id: routine.id });
                    });
                  }
                }}
                onStart={() => dispatch({ type: "OPEN_VIEW", routine })}
              />
            ))}
          </div>

          {dialog.mode === "view" && (
            <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
              <RoutineDialog
                routine={dialog.routine}
                onComplete={onCompleteRoutine}
                onPrev={onPrevRoutine}
              />
            </DialogContent>
          )}
        </Dialog>
      )}

      <EditRoutineDialog
        routine={dialog.mode === "edit" ? dialog.routine : undefined}
        open={dialog.mode === "edit"}
        onOpenChange={(o) => {
          if (!o) dispatch({ type: "CLOSE" });
        }}
      />
      <CreateRoutineDialog
        open={dialog.mode === "create"}
        onOpenChange={(o) => {
          dispatch({ type: o ? "OPEN_CREATE" : "CLOSE" });
        }}
      />
    </>
  );
}
