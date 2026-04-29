import { Routine } from "@/lib/types";
import { EllipseIcon, EllipsisVerticalIcon, MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function SessionCard({ routine }: { routine: Routine }) {
  return (
    <Card className="flex-cool flex h-26 cursor-pointer justify-between p-4 text-left select-none hover:shadow-md focus:ring">
      <CardHeader className="flex justify-between p-0">
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl">{routine.icon}</span>
          <CardTitle className="text-lg">{routine.title}</CardTitle>
        </div>
        <Button
          asChild
          variant="ghost"
          className="text-muted-foreground hover:text-foreground p-0"
          onClick={(e) => {
            e.preventDefault();
            console.log("CLICK");
          }}
        >
          <EllipsisVerticalIcon className="" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <CardDescription>{routine.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
