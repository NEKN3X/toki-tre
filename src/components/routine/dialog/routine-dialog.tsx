import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Routine } from "@/lib/types";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useReducer, useTransition } from "react";
import { CompleteView } from "./complete-view";
import { StepContent } from "./step-content";

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

interface Props {
  routine: Routine;
  onComplete: (id: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function RoutineDialog({
  routine,
  onComplete,
  onPrev,
  onNext,
}: Props) {
  const [progress, dispatchProgress] = useReducer(
    progressReducer,
    progressInitialState,
  );
  const [isPending, startTransition] = useTransition();
  const progressPercentage = (progress / routine.steps.length) * 100;
  const currentStep = routine.steps ? routine.steps[progress] : null;
  const isComplete = progress === routine.steps.length;

  return (
    <>
      <DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 select-none">
            <span className="text-4xl">{routine.icon}</span>
            <div className="flex flex-col justify-center gap-1">
              <DialogTitle className="line-clamp-1 overflow-hidden text-ellipsis">
                {routine.title}
              </DialogTitle>
              <DialogDescription className="line-clamp-1 overflow-hidden text-ellipsis">
                {routine.description}
              </DialogDescription>
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
                  : `Step ${progress + 1} of ${routine.steps.length}`}
              </span>
              <div className="flex items-center gap-2">
                {isPending && <Spinner className="size-3" />}
                <span>{progressPercentage.toFixed(0)}%</span>
              </div>
            </FieldLabel>
            <Progress value={progressPercentage} id="progress-upload" />
          </Field>
        </div>
      </DialogHeader>
      <div className="relative min-h-40">
        <div
          className={`transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}
        >
          <DialogFooter className="p-0">
            <div className="flex h-full w-full items-center gap-2 px-2 pb-10">
              <Button
                className="cursor-pointer"
                variant={"outline"}
                disabled={progress === 0 || isPending}
                size={"icon"}
                onClick={() => {
                  startTransition(() => {
                    onPrev?.();
                    dispatchProgress({ type: "prev" });
                  });
                }}
              >
                <ChevronLeftIcon />
              </Button>

              <div className="w-full text-center">
                {isComplete && <CompleteView />}
                {currentStep && !isComplete && (
                  <StepContent currentStep={currentStep} />
                )}
              </div>

              <Button
                className="cursor-pointer"
                variant={"outline"}
                disabled={isComplete || isPending}
                size={"icon"}
                onClick={() => {
                  startTransition(() => {
                    onNext?.();
                    dispatchProgress({ type: "next" });
                    if (progress === routine.steps.length - 1) {
                      onComplete(routine.id);
                    }
                  });
                }}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </DialogFooter>
        </div>
      </div>
    </>
  );
}
