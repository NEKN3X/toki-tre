import z from "zod";

export const stepSchema = z
  .object({
    title: z.string().min(1, "アクション名を入力してください"),
    icon: z.string().min(1, "アイコンを選択"),
    type: z.enum(["TEXT", "VIDEO"]),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "VIDEO") {
      if (!data.videoUrl || !data.videoUrl.startsWith("http")) {
        ctx.addIssue({
          code: "custom",
          message: "有効な動画URLを入力してください",
          path: ["videoUrl"],
        });
      }
    }
  });

export const routineSchema = z.object({
  title: z.string().min(1, "ルーティン名を入力してください"),
  icon: z.string().min(1, "アイコンを選択"),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1, "1つ以上のアクションが必要です"),
});
