import RoutineCard from "@/components/routine/card/routine-card";
import { Routine } from "@/lib/types";
import { EmptyState } from "./empty-state";

interface Props {
  routines: Routine[];
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
  onStart: (routine: Routine) => void;
}

export function RoutineList({ routines, onEdit, onDelete, onStart }: Props) {
  if (routines.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          onDelete={onDelete}
          onEdit={() => onEdit(routine)}
          onStart={() => onStart(routine)}
        />
      ))}
    </div>
  );
}
