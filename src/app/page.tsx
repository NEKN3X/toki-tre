"use client";

import SessionCard, { SessionItem } from "@/components/session-card";
import SessionDialog from "@/components/session-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import confetti from "canvas-confetti";
import { useState } from "react";

const data: SessionItem[] = [
  {
    id: "waking-up",
    icon: "🌄",
    title: "After waking up",
    description: "Get ready for the day",
    steps: [
      {
        icon: "💧",
        title: "Drink a glass of water",
        description: "Hydration!",
      },
      {
        icon: "🔥",
        title: "Stretching",
        description: "",
        youtubeUrl: "https://www.youtube.com/watch?v=ihba9Lw0tv4",
      },
    ],
  },
  {
    id: "home-workout",
    icon: "🏋️",
    title: "Home workout",
    description: "",
    steps: [
      {
        icon: "🔥",
        title: "Warm up",
        description: "",
        youtubeUrl: "https://www.youtube.com/watch?v=c0VxUFHdYzs",
      },
      {
        icon: "🏋️",
        title: "Full body workout",
        description: "",
        youtubeUrl: "https://www.youtube.com/watch?v=icoe6C2E-aY",
      },
    ],
  },
];

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionItem>();
  const [closeTimer, setCloseTimer] = useState<NodeJS.Timeout>();

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        clearTimeout(closeTimer);
        setDialogOpen(open);
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {data.map((session) => (
            <DialogTrigger
              key={session.id}
              className="rounded-xl"
              onClick={() => setSelectedSession(session)}
            >
              <SessionCard session={session} />
            </DialogTrigger>
          ))}
        </div>
      </div>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
        {selectedSession && (
          <SessionDialog
            session={selectedSession}
            onComplete={() => {
              confetti({
                particleCount: 100,
                startVelocity: 25,
                spread: 360,
              });
              setCloseTimer(
                setTimeout(() => {
                  setDialogOpen(false);
                }, 2500),
              );
            }}
            onPrev={() => {
              clearTimeout(closeTimer);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
