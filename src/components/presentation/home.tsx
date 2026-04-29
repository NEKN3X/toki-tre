"use client";

import { deleteRoutine } from "@/app/actions";
import RoutineCard from "@/components/routine/routine-card";
import RoutineDialog from "@/components/routine/routine-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Routine } from "@/lib/types";
import confetti from "canvas-confetti";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import CreateRoutineDialog from "../routine/create-routine-dialog";
import EditRoutineDialog from "../routine/edit-routine-dialog";

export default function HomePresentation({
  routines,
}: {
  routines: Routine[];
}) {
  const [selectedRoutine, setSelectedRoutine] = useState<Routine>();
  const [editRoutine, setEditRoutine] = useState<Routine>();
  const [closeTimer, setCloseTimer] = useState<NodeJS.Timeout>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { execute: deleteAction } = useAction(deleteRoutine);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          clearTimeout(closeTimer);
          setDialogOpen(open);
        }}
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onEdit={() => setEditRoutine(routine)}
              onDelete={() => {
                if (confirm("このルーティンを削除しますか？")) {
                  deleteAction({ id: routine.id });
                }
              }}
              onClick={() => setSelectedRoutine(routine)}
            />
          ))}
        </div>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          {selectedRoutine && (
            <RoutineDialog
              routine={selectedRoutine}
              onComplete={() => {
                confetti({
                  particleCount: 100,
                  startVelocity: 25,
                  spread: 360,
                });
                setCloseTimer(
                  setTimeout(() => {
                    setDialogOpen(false);
                  }, 2500),
                );
              }}
              onPrev={() => {
                clearTimeout(closeTimer);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <EditRoutineDialog
        routine={editRoutine}
        onOpenChange={(o) => {
          if (!o) setEditRoutine(undefined);
        }}
      />
      <CreateRoutineDialog />
    </>
  );
}
