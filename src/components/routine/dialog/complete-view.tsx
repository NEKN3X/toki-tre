export function CompleteView() {
  return (
    <div className="mt-10 flex aspect-video flex-auto flex-col justify-center gap-4 select-none">
      <div className="text-6xl">🎉</div>
      <h3 className="text-3xl font-bold">Great job!</h3>
      <p className="text-muted-foreground text-lg">
        You completed the session.
      </p>
    </div>
  );
}
