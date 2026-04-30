import { describe, expect, it } from "vitest";
import { routineWithIdSchema } from "./schema";

describe("routineWithIdSchema", () => {
  const validRoutine = {
    id: "test-id",
    title: "朝のルーティン",
    icon: "🌅",
    description: "毎日やること",
    steps: [
      {
        title: "白湯を飲む",
        icon: "🍵",
        type: "TEXT",
        description: "ゆっくり飲む",
      },
    ],
  };

  it("有効なデータであればパスする", () => {
    const result = routineWithIdSchema.safeParse(validRoutine);
    expect(result.success).toBe(true);
  });

  it("タイトルが空の場合はエラーになる", () => {
    const invalidData = { ...validRoutine, title: "" };
    const result = routineWithIdSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("VIDEOタイプを選択してURLが空の場合はエラーになる", () => {
    const invalidData = {
      ...validRoutine,
      steps: [
        {
          title: "ヨガ",
          icon: "🧘",
          type: "VIDEO",
          videoUrl: "",
        },
      ],
    };
    const result = routineWithIdSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const errorField = result.error.issues[0].path;
      expect(errorField).toContain("videoUrl");
    }
  });

  it("TEXTタイプならvideoUrlがなくてもパスする", () => {
    const data = {
      ...validRoutine,
      steps: [
        {
          title: "読書",
          icon: "📖",
          type: "TEXT",
          description: "5ページ読む",
          videoUrl: "",
        },
      ],
    };
    expect(routineWithIdSchema.safeParse(data).success).toBe(true);
  });
});
