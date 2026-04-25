"use client";

import SessionCard, { SessionItem } from "@/components/session-card";
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
        videoId: "ihba9Lw0tv4",
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
        videoId: "c0VxUFHdYzs",
      },
      {
        icon: "🏋️",
        title: "Full body workout",
        description: "",
        videoId: "icoe6C2E-aY",
      },
    ],
  },
  {
    id: "neck-hurt",
    icon: "💫",
    title: "Neck hurt",
    description: "",
    playlistId: "PLQ0m31Gjddkt47uNY32OUWrWmNrD_998V",
  },
  {
    id: "neck-hurt2",
    icon: "💫",
    title: "Neck hurt",
    description: "",
    playlistId: "PLQ0m31Gjddkt47uNY32OUWrWmNrD_998V",
  },
  {
    id: "neck-hurt3",
    icon: "💫",
    title: "Neck hurt",
    description: "",
    playlistId: "PLQ0m31Gjddkt47uNY32OUWrWmNrD_998V",
  },
];

export default function Home() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const handleComplete = (id: string) => {
    setCompletedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {data.map((item) => (
          <SessionCard key={item.id} item={item} onComplete={handleComplete} />
        ))}
      </div>
    </div>
  );
}
