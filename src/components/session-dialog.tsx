import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useReducer, useState } from "react";
import { SessionItem } from "./session-card";
import { Button } from "./ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldLabel } from "./ui/field";
import { Progress } from "./ui/progress";

const initialState = 1;
const reducer = (
  state: number,
  action: { type: "next" | "prev" | "reset" },
) => {
  switch (action.type) {
    case "next":
      return state + 1;
    case "prev":
      return state - 1;
    case "reset":
      return initialState;
    default:
      return state;
  }
};

export default function SessionDialog({
  session,
  onComplete,
}: {
  session: SessionItem;
  onComplete: (id: string) => void;
}) {
  const [progress, dispatchProgress] = useReducer(reducer, initialState);
  const progressPercentage = useMemo(() => {
    if (!session.steps) return 0;
    return ((progress - 1) / session.steps.length) * 100;
  }, [session.steps, progress]);
  const currentStep = session.steps ? session.steps[progress - 1] : null;
  const [isComplete, setIsComplete] = useState(false);

  return (
    <>
      <DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 select-none">
            <span className="text-4xl">{session.icon}</span>
            <div className="flex flex-col gap-0">
              <DialogTitle>{session.title}</DialogTitle>
              <DialogDescription>{session.description}</DialogDescription>
            </div>
          </div>

          {session.steps && (
            <Field className="w-full">
              <FieldLabel htmlFor="progress-upload">
                <span>
                  {isComplete
                    ? "Completed!"
                    : `Step ${progress} of ${session.steps.length}`}
                </span>
                <span className="ml-auto">
                  {progressPercentage.toFixed(0)}%
                </span>
              </FieldLabel>
              <Progress value={progressPercentage} id="progress-upload" />
            </Field>
          )}
        </div>
      </DialogHeader>
      <DialogFooter className="min-h-100">
        <div className="flex h-full w-full flex-col text-center">
          {currentStep && !isComplete && (
            <div className="flex flex-auto flex-col justify-center p-8 select-none">
              <div className="flex flex-1 flex-col justify-end text-6xl">
                {currentStep.icon}
              </div>
              <h3 className="flex flex-1 flex-col justify-center text-3xl font-bold">
                {currentStep.title}
              </h3>
              <p className="text-muted-foreground flex flex-1 flex-col justify-start text-lg">
                {currentStep.description}
              </p>
            </div>
          )}
          {isComplete && (
            <div className="flex flex-auto flex-col justify-center p-8 select-none">
              <div className="flex flex-1 flex-col justify-end text-6xl">
                🎉
              </div>
              <h3 className="flex flex-1 flex-col justify-center text-3xl font-bold">
                Great job!
              </h3>
              <p className="text-muted-foreground flex flex-1 flex-col justify-start text-lg">
                You completed the session.
              </p>
            </div>
          )}
          <div className="flex w-full justify-between">
            {(progress === 1 || isComplete) && (
              <Button disabled variant={"ghost"}></Button>
            )}
            {progress !== 1 && !isComplete && (
              <Button
                className="flex cursor-pointer"
                variant={"outline"}
                onClick={() => {
                  setIsComplete(false);
                  dispatchProgress({ type: "prev" });
                }}
              >
                <ChevronLeftIcon />
                <span>Back</span>
              </Button>
            )}
            {!isComplete && progress !== session.steps?.length && (
              <Button
                className="flex cursor-pointer"
                onClick={() => dispatchProgress({ type: "next" })}
              >
                <span>Next</span>
                <ChevronRightIcon className="right-2 pt-0.5" />
              </Button>
            )}
            {!isComplete && progress === session.steps?.length && (
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setIsComplete(true);
                  dispatchProgress({ type: "next" });
                  onComplete(session.id);
                }}
              >
                <span>Complete 🎉</span>
              </Button>
            )}
          </div>
        </div>
      </DialogFooter>
    </>
  );
}
