export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-muted-foreground text-lg">
        まだルーティンがありません
      </p>
      <p className="text-muted-foreground text-sm">
        右下の＋ボタンから作成しましょう
      </p>
    </div>
  );
}
