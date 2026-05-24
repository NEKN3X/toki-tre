import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { dialogReducer, useDialog } from "./use-dialog";
import type { DialogAction, DialogState } from "./use-dialog";

const mockRoutine = {
  id: "routine-1",
  userId: "user-1",
  icon: "🌅",
  title: "朝のルーティン",
  description: "毎朝の習慣",
  createdAt: new Date(),
  updatedAt: new Date(),
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

describe("dialogReducer", () => {
  const initialState: DialogState = { mode: "idle" };

  it("OPEN_VIEW で view モードになる", () => {
    const action: DialogAction = { type: "OPEN_VIEW", routine: mockRoutine };
    const state = dialogReducer(initialState, action);
    expect(state).toEqual({ mode: "view", routine: mockRoutine });
  });

  it("OPEN_EDIT で edit モードになる", () => {
    const action: DialogAction = { type: "OPEN_EDIT", routine: mockRoutine };
    const state = dialogReducer(initialState, action);
    expect(state).toEqual({ mode: "edit", routine: mockRoutine });
  });

  it("OPEN_CREATE で create モードになる", () => {
    const action: DialogAction = { type: "OPEN_CREATE" };
    const state = dialogReducer(initialState, action);
    expect(state).toEqual({ mode: "create" });
  });

  it("CLOSE で idle に戻る", () => {
    const viewState: DialogState = { mode: "view", routine: mockRoutine };
    const action: DialogAction = { type: "CLOSE" };
    const state = dialogReducer(viewState, action);
    expect(state).toEqual({ mode: "idle" });
  });

  it("edit 状態から CLOSE で idle に戻る", () => {
    const editState: DialogState = { mode: "edit", routine: mockRoutine };
    const action: DialogAction = { type: "CLOSE" };
    const state = dialogReducer(editState, action);
    expect(state).toEqual({ mode: "idle" });
  });

  it("view から OPEN_EDIT で上書きされる", () => {
    const viewState: DialogState = { mode: "view", routine: mockRoutine };
    const newRoutine = { ...mockRoutine, title: "夜のルーティン" };
    const action: DialogAction = { type: "OPEN_EDIT", routine: newRoutine };
    const state = dialogReducer(viewState, action);
    expect(state).toEqual({ mode: "edit", routine: newRoutine });
  });
});

describe("useDialog", () => {
  it("初期状態は idle", () => {
    const { result } = renderHook(() => useDialog());
    const [state] = result.current;
    expect(state).toEqual({ mode: "idle" });
  });

  it("dispatch OPEN_VIEW で view モードに遷移する", () => {
    const { result } = renderHook(() => useDialog());
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: "OPEN_VIEW", routine: mockRoutine });
    });

    const [state] = result.current;
    expect(state).toEqual({ mode: "view", routine: mockRoutine });
  });

  it("dispatch OPEN_CREATE で create モードに遷移する", () => {
    const { result } = renderHook(() => useDialog());
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: "OPEN_CREATE" });
    });

    const [state] = result.current;
    expect(state).toEqual({ mode: "create" });
  });

  it("dispatch CLOSE で idle に戻る", () => {
    const { result } = renderHook(() => useDialog());
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: "OPEN_CREATE" });
    });
    act(() => {
      dispatch({ type: "CLOSE" });
    });

    const [state] = result.current;
    expect(state).toEqual({ mode: "idle" });
  });
});
