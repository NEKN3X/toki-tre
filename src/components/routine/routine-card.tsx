import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type RoutineAction = {
  icon: string;
  title: string;
  description: string;
  youtubeUrl?: string;
};

export type Routine = {
  id: string;
  icon: string;
  title: string;
  description: string;
  steps: RoutineAction[];
};

export default function SessionCard({ session }: { session: Routine }) {
  return (
    <Card className="h-36 cursor-pointer text-left select-none hover:shadow-md focus:ring">
      <CardHeader>
        <span className="text-4xl">{session.icon}</span>
        <CardTitle className="text-lg">{session.title}</CardTitle>
        <CardDescription>{session.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
