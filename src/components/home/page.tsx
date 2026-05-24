"use client";

import RoutineDialog from "@/components/routine/dialog/routine-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Routine } from "@/lib/types";
import CreateRoutineDialog from "../routine/create-routine-dialog";
import EditRoutineDialog from "../routine/edit-routine-dialog";
import { useRoutineDelete } from "./hooks/use-routine-delete";
import { useRoutineDialog } from "./hooks/use-routine-dialog";
import { RoutineList } from "./routine-list";

export default function HomePage({ routines }: { routines: Routine[] }) {
  const { dialog, dispatch, onOpenChange, onCompleteRoutine, onPrevRoutine } =
    useRoutineDialog();
  const { optimisticRoutines, handleDelete } = useRoutineDelete(routines);

  return (
    <>
      <Dialog open={dialog.mode === "view"} onOpenChange={onOpenChange}>
        <RoutineList
          routines={optimisticRoutines}
          onDelete={handleDelete}
          onEdit={(routine) => dispatch({ type: "OPEN_EDIT", routine })}
          onStart={(routine) => dispatch({ type: "OPEN_VIEW", routine })}
        />

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
