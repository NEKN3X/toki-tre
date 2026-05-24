import type { RoutineStep } from "@/lib/types";
import { YouTubePlayer } from "./youtube-player";

interface StepContentProps {
  currentStep: RoutineStep;
}

export function StepContent({ currentStep }: StepContentProps) {
  if (currentStep.videoUrl) {
    return (
      <div className="flex flex-auto flex-col justify-center select-none">
        <div className="flex h-10 items-center justify-center gap-2 overflow-hidden">
          <span>{currentStep.icon}</span>
          <div>{currentStep.title}</div>
        </div>
        <YouTubePlayer youtubeUrl={currentStep.videoUrl} />
      </div>
    );
  }

  return (
    <div className="mt-10 flex aspect-video flex-auto flex-col justify-center gap-6 select-none">
      <div className="text-6xl">{currentStep.icon}</div>
      <h3 className="text-3xl font-bold">{currentStep.title}</h3>
      <p className="text-muted-foreground text-lg">{currentStep.description}</p>
    </div>
  );
}
