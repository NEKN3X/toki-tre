import confetti from "canvas-confetti";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useReducer, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldLabel } from "./ui/field";
import { Progress } from "./ui/progress";

export type SessionStep = {
  icon: string;
  title: string;
  description: string;
  videoId?: string;
};

export type SessionItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  steps?: SessionStep[];
  playlistId?: string;
};

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

export default function SessionCard({
  item,
  onComplete,
}: {
  item: SessionItem;
  onComplete: (id: string) => void;
}) {
  const [progress, dispatchProgress] = useReducer(reducer, initialState);
  const progressPercentage = useMemo(() => {
    if (!item.steps) return 0;
    return ((progress - 1) / item.steps.length) * 100;
  }, [item.steps, progress]);
  const currentStep = item.steps ? item.steps[progress - 1] : null;
  const [isComplete, setIsComplete] = useState(false);
  const [open, setOpen] = useState(false);
  const [closeTimer, setCloseTimer] = useState<ReturnType<typeof setTimeout>>();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card
          tabIndex={0}
          className="h-36 cursor-pointer select-none hover:shadow-md focus:ring"
          onClick={() => {
            setIsComplete(false);
            dispatchProgress({ type: "reset" });
            clearTimeout(closeTimer);
          }}
        >
          <CardHeader>
            <span className="text-4xl">{item.icon}</span>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            <CardAction onClick={() => onComplete(item.id)}></CardAction>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
        <DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 select-none">
              <span className="text-4xl">{item.icon}</span>
              <div className="flex flex-col gap-0">
                <DialogTitle>{item.title}</DialogTitle>
                <DialogDescription>{item.description}</DialogDescription>
              </div>
            </div>

            {item.steps && (
              <Field className="w-full">
                <FieldLabel htmlFor="progress-upload">
                  <span>
                    {isComplete
                      ? "Completed!"
                      : `Step ${progress} of ${item.steps.length}`}
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
              {!isComplete && progress !== item.steps?.length && (
                <Button
                  className="flex cursor-pointer"
                  onClick={() => dispatchProgress({ type: "next" })}
                >
                  <span>Next</span>
                  <ChevronRightIcon className="pt-0.5" />
                </Button>
              )}
              {!isComplete && progress === item.steps?.length && (
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    setIsComplete(true);
                    dispatchProgress({ type: "next" });
                    onComplete(item.id);
                    setCloseTimer(
                      setTimeout(() => {
                        setOpen(false);
                      }, 2000),
                    );
                    confetti({
                      particleCount: 100,
                      startVelocity: 25,
                      spread: 360,
                    });
                  }}
                >
                  <span>Complete 🎉</span>
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
