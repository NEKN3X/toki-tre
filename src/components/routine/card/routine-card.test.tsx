import { Dialog } from "@/components/ui/dialog";
import type { Routine } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RoutineCard from "./routine-card";

// ── Fixtures ──

const baseRoutine: Routine = {
  id: "routine-1",
  userId: "user-1",
  icon: "🌅",
  title: "朝のルーティン",
  description: "毎朝の習慣",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  steps: [
    {
      id: "step-1",
      routineId: "routine-1",
      order: 0,
      icon: "🍵",
      title: "白湯を飲む",
      type: "TEXT" as const,
      description: "ゆっくりと",
      videoUrl: null,
    },
  ],
};

// ── Helpers ──

function renderCard(props: Partial<Parameters<typeof RoutineCard>[0]> = {}) {
  return render(
    <Dialog>
      <RoutineCard
        routine={baseRoutine}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStart={vi.fn()}
        {...props}
      />
    </Dialog>,
  );
}

// ── Tests ──

describe("RoutineCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ルーティンのタイトルとアイコンと説明を表示する", () => {
    renderCard();
    expect(screen.getByText("🌅")).toBeInTheDocument();
    expect(screen.getByText("朝のルーティン")).toBeInTheDocument();
    expect(screen.getByText("毎朝の習慣")).toBeInTheDocument();
  });

  it("説明がない場合でもカードの説明領域が空でレンダリングされる", () => {
    renderCard({
      routine: { ...baseRoutine, description: null },
    });
    const title = screen.getByText("朝のルーティン");
    expect(title).toBeInTheDocument();
    const startButton = screen.getByText("Start");
    expect(startButton).toBeInTheDocument();
  });

  it("Start ボタンがクリックできる", async () => {
    const onStart = vi.fn();
    renderCard({ onStart });
    await userEvent.click(screen.getByText("Start"));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("編集をクリックすると onEdit が呼ばれる", async () => {
    const onEdit = vi.fn();
    renderCard({ onEdit });

    const trigger = screen.getAllByRole("button")[0];
    await userEvent.click(trigger);

    const editItem = await screen.findByText("編集");
    await userEvent.click(editItem);
    expect(onEdit).toHaveBeenCalledWith(baseRoutine);
  });

  it("削除を確認すると onDelete が呼ばれる", async () => {
    const onDelete = vi.fn();
    renderCard({ onDelete });

    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    const trigger = screen.getAllByRole("button")[0];
    await userEvent.click(trigger);

    const deleteItem = await screen.findByText("削除");
    await userEvent.click(deleteItem);

    expect(onDelete).toHaveBeenCalledWith("routine-1");

    window.confirm = originalConfirm;
  });

  it("削除をキャンセルすると onDelete は呼ばれない", async () => {
    const onDelete = vi.fn();
    renderCard({ onDelete });

    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => false);

    const trigger = screen.getAllByRole("button")[0];
    await userEvent.click(trigger);

    const deleteItem = await screen.findByText("削除");
    await userEvent.click(deleteItem);

    expect(onDelete).not.toHaveBeenCalled();

    window.confirm = originalConfirm;
  });
});
