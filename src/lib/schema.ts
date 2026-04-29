import z from "zod";

export const stepSchema = z
  .object({
    title: z
      .string()
      .min(1, "アクション名を入力してください")
      .max(30, "最大30文字です"),
    icon: z.string().min(1, "アイコンを選択"),
    type: z.enum(["TEXT", "VIDEO"]),
    description: z.string().max(50, "最大50文字です"),
    videoUrl: z.string().max(100),
  })
  .superRefine((data, ctx) => {
    if (data.type === "VIDEO") {
      if (!data.videoUrl.startsWith("https://www.youtube.com")) {
        ctx.addIssue({
          code: "custom",
          message: "有効な動画URLを入力してください",
          path: ["videoUrl"],
        });
      }
    }
  });

export const stepWithIdSchema = stepSchema.extend({
  id: z.string().min(1, "ステップIDを入力してください"),
});

export const routineSchema = z.object({
  title: z
    .string()
    .min(1, "ルーティン名を入力してください")
    .max(30, "最大30文字です"),
  icon: z.string().min(1, "アイコンを選択"),
  description: z.string().max(50, "最大50文字です"),
  steps: z.array(stepSchema).min(1, "1つ以上のアクションが必要です"),
});

export const routineWithIdSchema = routineSchema.extend({
  id: z.string().min(1, "ルーティンIDを入力してください"),
});
