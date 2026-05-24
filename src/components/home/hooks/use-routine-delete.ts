import { deleteRoutine } from "@/app/actions";
import { Routine } from "@/lib/types";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useOptimistic, useTransition } from "react";

export function useRoutineDelete(routines: Routine[]) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [optimisticRoutines, optimisticDeleteRoutine] = useOptimistic(
    routines,
    (state, routineId: string) => state.filter((r) => r.id !== routineId),
  );

  const { execute: deleteAction } = useAction(deleteRoutine, {
    onError: () => {
      router.refresh();
    },
  });

  const handleDelete = useCallback(
    (id: string) => {
      startTransition(() => {
        optimisticDeleteRoutine(id);
        deleteAction({ id });
      });
    },
    [optimisticDeleteRoutine, deleteAction, startTransition],
  );

  return { optimisticRoutines, handleDelete } as const;
}
