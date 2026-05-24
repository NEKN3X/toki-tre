import { deleteRoutine } from "@/app/actions";
import { Routine } from "@/lib/types";
import { EllipsisVerticalIcon, Pencil, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Props {
  routine: Routine;
  onEdit: (routine: Routine) => void;
  onDeleteSuccess?: (id: string) => void;
  onStart?: MouseEventHandler<HTMLButtonElement>;
}

export default function RoutineCard({
  routine,
  onEdit,
  onDeleteSuccess,
  onStart,
}: Props) {
  const router = useRouter();

  const { execute: deleteAction, isExecuting } = useAction(deleteRoutine, {
    onSuccess: () => {
      onDeleteSuccess?.(routine.id);
    },
    onError: () => {
      router.refresh();
    },
  });

  return (
    <Card className="flex flex-col justify-between text-left select-none">
      <CardHeader className="flex justify-between">
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl">{routine.icon}</span>
          <CardTitle className="line-clamp-2 w-full overflow-hidden text-wrap text-ellipsis">
            {routine.title}
          </CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              disabled={isExecuting}
              className="text-muted-foreground hover:text-foreground -mr-2 h-8 w-8"
            >
              <EllipsisVerticalIcon className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-32"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={() => onEdit(routine)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 size-4" />
              <span>編集</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (confirm("このルーティンを削除しますか？")) {
                  deleteAction({ id: routine.id });
                }
              }}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="mr-2 size-4" />
              <span>削除</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <CardDescription className="overflow-hidden text-nowrap text-ellipsis">
          {routine.description || "\u00A0"}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex gap-2">
        <DialogTrigger
          onClick={onStart}
          disabled={isExecuting}
          asChild
          className="flex-1"
        >
          <Button>Start</Button>
        </DialogTrigger>
      </CardFooter>
    </Card>
  );
}
