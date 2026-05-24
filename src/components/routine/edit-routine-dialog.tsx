import { Routine } from "@/lib/types";
import { Dialog, DialogContent } from "../ui/dialog";
import { RoutineForm } from "./routine-form";

interface Props {
  routine?: Routine;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function EditRoutineDialog({ routine, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <RoutineForm
          mode="edit"
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
