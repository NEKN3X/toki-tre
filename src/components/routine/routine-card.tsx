import { Routine } from "@/lib/types";
import { EllipsisVerticalIcon, Pencil, Trash2 } from "lucide-react";
import { MouseEventHandler, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  onDelete: (id: string) => void;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function RoutineCard({
  routine,
  onEdit,
  onDelete,
  onClick,
}: Props) {
  const [disabled, setDisabled] = useState(false);

  return (
    <DialogTrigger className="rounded-xl" onClick={onClick} disabled={disabled}>
      <Card className="flex-cool flex h-28 cursor-pointer justify-between p-4 text-left select-none hover:shadow-md focus:ring">
        <CardHeader className="flex justify-between p-0">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl">{routine.icon}</span>
            <CardTitle className="line-clamp-2 w-full overflow-hidden text-wrap text-ellipsis">
              {routine.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                asChild
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
                  setDisabled(true);
                  onDelete(routine.id);
                }}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 size-4" />
                <span>削除</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="pl-1.5">
          <CardDescription className="overflow-hidden text-nowrap text-ellipsis">
            {routine.description}
          </CardDescription>
        </CardContent>
      </Card>
    </DialogTrigger>
  );
}
