"use client";

import AddRoutineDialog from "@/components/routine/add-routine-dialog";
import RoutineCard from "@/components/routine/routine-card";
import RoutineDialog from "@/components/routine/routine-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Routine } from "@/lib/types";
import confetti from "canvas-confetti";
import { useState } from "react";

export default function HomePresentation({
  routines,
}: {
  routines: Routine[];
}) {
  const [selectedRoutine, setSelectedRoutine] = useState<Routine>();
  const [closeTimer, setCloseTimer] = useState<NodeJS.Timeout>();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          clearTimeout(closeTimer);
          setDialogOpen(open);
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {routines.map((routine) => (
              <DialogTrigger
                key={routine.id}
                className="rounded-xl"
                onClick={() => setSelectedRoutine(routine)}
              >
                <RoutineCard routine={routine} />
              </DialogTrigger>
            ))}
          </div>
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
      <AddRoutineDialog />
    </>
  );
}
