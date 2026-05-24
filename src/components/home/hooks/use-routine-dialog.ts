import confetti from "canvas-confetti";
import { useCallback, useRef } from "react";
import { useDialog } from "./use-dialog";

export function useRoutineDialog() {
  const [dialog, dispatch] = useDialog();
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) return;
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      dispatch({ type: "CLOSE" });
    },
    [dispatch, closeTimerRef],
  );

  const onCompleteRoutine = useCallback(() => {
    confetti({
      particleCount: 100,
      startVelocity: 25,
      spread: 360,
    });
    closeTimerRef.current = setTimeout(() => {
      dispatch({ type: "CLOSE" });
    }, 2500);
  }, [dispatch, closeTimerRef]);

  const onPrevRoutine = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, [closeTimerRef]);

  return {
    dialog,
    dispatch,
    onOpenChange,
    onCompleteRoutine,
    onPrevRoutine,
  } as const;
}
