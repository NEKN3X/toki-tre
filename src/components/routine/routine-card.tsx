import { Routine } from "@/lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function SessionCard({ routine }: { routine: Routine }) {
  return (
    <Card className="h-36 cursor-pointer text-left select-none hover:opacity-80 hover:shadow-md focus:ring">
      <CardHeader>
        <span className="text-4xl">{routine.icon}</span>
        <CardTitle className="text-lg">{routine.title}</CardTitle>
        <CardDescription>{routine.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
