import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export type SessionStep = {
  icon: string;
  title: string;
  description: string;
  youtubeUrl?: string;
};

export type SessionItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  steps: SessionStep[];
};

export default function SessionCard({ session }: { session: SessionItem }) {
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
