"use client";

import { deleteRoutine } from "@/app/actions";
import RoutineCard from "@/components/routine/card/routine-card";
import RoutineDialog from "@/components/routine/dialog/routine-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDialog } from "@/hooks/use-dialog";
import { Routine } from "@/lib/types";
import confetti from "canvas-confetti";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useOptimistic,
  useRef,
  useTransition,
} from "react";
import CreateRoutineDialog from "../routine/create-routine-dialog";
import EditRoutineDialog from "../routine/edit-routine-dialog";
import { EmptyState } from "./empty-state";

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
  const router = useRouter();
  const { execute: deleteAction } = useAction(deleteRoutine, {
    onError: () => {
      router.refresh();
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
        <EmptyState />
      ) : (
        <Dialog open={dialog.mode === "view"} onOpenChange={onOpenChange}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {optimisticRoutines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onEdit={() => dispatch({ type: "OPEN_EDIT", routine })}
                onDelete={(id) => {
                  startTransition(() => {
                    optimisticDeleteRoutine(id);
                    deleteAction({ id });
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
