import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { RoutineForm } from "./routine-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateRoutineDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed right-8 bottom-8 h-16 w-16 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
        >
          <Plus className="size-10" strokeWidth={3} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <RoutineForm
          mode="create"
          title={"新しいルーティンを作成する"}
          description={""}
          submitLabel={"作成する"}
          onSubmit={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
