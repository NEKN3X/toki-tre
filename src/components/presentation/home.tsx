"use client";

import RoutineCard from "@/components/routine/routine-card";
import RoutineDialog from "@/components/routine/routine-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDialog } from "@/hooks/use-dialog";
import { Routine } from "@/lib/types";
import confetti from "canvas-confetti";
import {
  useCallback,
  useOptimistic,
  useRef,
  useTransition,
} from "react";
import CreateRoutineDialog from "../routine/create-routine-dialog";
import EditRoutineDialog from "../routine/edit-routine-dialog";

export default function HomePresentation({
  routines,
}: {
  routines: Routine[];
}) {
  const [dialog, dispatch] = useDialog();
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [, startTransition] = useTransition();
  const [optimisticRoutines, optimisticDeleteRoutine] = useOptimistic(
    routines,
    (state, routineId: string) => state.filter((r) => r.id !== routineId),
  );

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
                onDeleteSuccess={(id) => {
                  startTransition(() => {
                    optimisticDeleteRoutine(id);
                  });
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
