import { Routine } from "@/lib/types";
import { Dialog, DialogContent } from "../ui/dialog";
import { RoutineForm } from "./edit-routine-form";

interface Props {
  routine?: Routine;
  onOpenChange?: (open: boolean) => void;
}

export default function EditRoutineDialog({ routine, onOpenChange }: Props) {
  return (
    <Dialog open={!!routine} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <RoutineForm
          routine={routine}
          onSubmit={() => onOpenChange?.(false)}
          title={"ルーティンを編集する"}
          description={""}
          submitLabel={"保存する"}
        />
      </DialogContent>
    </Dialog>
  );
}
