import { PlusIcon } from "lucide-react";
import { Card, CardHeader } from "../ui/card";

export default function RoutineNewCard() {
  return (
    <Card className="h-36 cursor-pointer text-left select-none hover:shadow-md focus:ring">
      <CardHeader>
        <PlusIcon />
      </CardHeader>
    </Card>
  );
}
