import { Routine } from "@/lib/types";
import { EllipsisVerticalIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface SessionCardProps {
  routine: Routine;
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

export default function SessionCard({
  routine,
  onEdit,
  onDelete,
}: SessionCardProps) {
  return (
    <Card className="flex-cool flex h-26 cursor-pointer justify-between p-4 text-left select-none hover:shadow-md focus:ring">
      <CardHeader className="flex justify-between p-0">
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl">{routine.icon}</span>
          <CardTitle className="text-lg">{routine.title}</CardTitle>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
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
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => onEdit(routine)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 size-4" />
                <span>編集</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(routine.id)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 size-4" />
                <span>削除</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <CardDescription>{routine.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
