import { Routine } from "@/lib/types";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useReducer } from "react";
import { Button } from "../ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Progress } from "../ui/progress";

const progressInitialState = 0;
const progressReducer = (
  state: number,
  action: { type: "next" | "prev" | "reset" },
) => {
  switch (action.type) {
    case "next":
      return state + 1;
    case "prev":
      return state - 1;
    case "reset":
      return progressInitialState;
    default:
      return state;
  }
};

const YouTubePlayer = ({ youtubeUrl: youtubeUrl }: { youtubeUrl: string }) => {
  const videoId = youtubeUrl.match(/v=([^&]+)/)?.[1];
  const playlist = youtubeUrl.match(/list=([^&]+)/)?.[1];
  return (
    <iframe
      src={`https://www.youtube.com/embed/${playlist ? "videoseries?list=" + playlist : videoId}`}
      className="aspect-video w-full"
      allowFullScreen
    ></iframe>
  );
};

export default function SessionDialog({
  routine,
  onComplete,
  onPrev,
  onNext,
}: {
  routine: Routine;
  onComplete: (id: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const [progress, dispatchProgress] = useReducer(
    progressReducer,
    progressInitialState,
  );
  const progressPercentage = (progress / routine.actions.length) * 100;
  const currentAction = routine.actions ? routine.actions[progress] : null;
  const isComplete = progress === routine.actions.length;

  return (
    <>
      <DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 select-none">
            <span className="text-4xl">{routine.icon}</span>
            <div className="flex flex-col gap-0">
              <DialogTitle>{routine.title}</DialogTitle>
              <DialogDescription>{routine.description}</DialogDescription>
            </div>
          </div>

          <Field className="w-full">
            <FieldLabel
              htmlFor="progress-upload"
              className="flex justify-between"
            >
              <span>
                {isComplete
                  ? "Completed!"
                  : `Step ${progress + 1} of ${routine.actions.length}`}
              </span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </FieldLabel>
            <Progress value={progressPercentage} id="progress-upload" />
          </Field>
        </div>
      </DialogHeader>
      <DialogFooter className="p-0">
        <div className="flex h-full w-full items-center gap-2 px-2 py-10">
          <Button
            className="cursor-pointer"
            variant={"outline"}
            disabled={progress === 0}
            size={"icon"}
            onClick={() => {
              onPrev?.();
              dispatchProgress({ type: "prev" });
            }}
          >
            <ChevronLeftIcon />
          </Button>

          <div className="w-full text-center">
            {isComplete && (
              <div className="flex aspect-video flex-auto flex-col justify-center gap-4 select-none">
                <div className="text-6xl">🎉</div>
                <h3 className="text-3xl font-bold">Great job!</h3>
                <p className="text-muted-foreground text-lg">
                  You completed the session.
                </p>
              </div>
            )}
            {currentAction && !isComplete && currentAction.videoUrl && (
              <div className="flex flex-auto flex-col justify-center gap-4 select-none">
                <YouTubePlayer youtubeUrl={currentAction.videoUrl} />
              </div>
            )}
            {currentAction && !isComplete && !currentAction.videoUrl && (
              <div className="flex aspect-video flex-auto flex-col justify-center gap-6 select-none">
                <div className="text-6xl">{currentAction.icon}</div>
                <h3 className="text-3xl font-bold">{currentAction.title}</h3>
                <p className="text-muted-foreground text-lg">
                  {currentAction.description}
                </p>
              </div>
            )}
          </div>

          <Button
            className="cursor-pointer"
            variant={"outline"}
            disabled={isComplete}
            size={"icon"}
            onClick={() => {
              onNext?.();
              dispatchProgress({ type: "next" });
              if (progress === routine.actions.length - 1) {
                onComplete(routine.id);
              }
            }}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
