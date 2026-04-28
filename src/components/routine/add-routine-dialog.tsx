"use client";

import * as React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { FileText, Plus, Trash2, Video } from "lucide-react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Separator } from "../ui/separator";

const actionSchema = z
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
          code: z.ZodIssueCode.custom,
          message: "有効な動画URLを入力してください",
          path: ["videoUrl"],
        });
      }
    }
  });

const formSchema = z.object({
  title: z.string().min(1, "ルーティン名を入力してください"),
  actions: z.array(actionSchema).min(1, "1つ以上のアクションが必要です"),
});

export function AddRoutineDialog() {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // リアルタイムにバリデーションを走らせてボタンを制御
    defaultValues: {
      title: "",
      actions: [{ title: "", icon: "🏋️", type: "TEXT", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "actions",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Saving Routine and Actions:", data);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed right-8 bottom-8 h-16 w-16 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
        >
          <Plus className="size-10" strokeWidth={3} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form
          id="routine-complex-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              新しいルーティンを作成する
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            {/* Routine Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>ルーティンの名前</FieldLabel>
                  <Input
                    {...field}
                    placeholder="例: 朝起きたらすぐに、夜寝る前に"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Actions List */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-wider uppercase">
                  ステップ
                </h3>
                <span className="text-muted-foreground text-xs">
                  {fields.length} ステップ
                </span>
              </div>

              <div>
                {fields.map((field, index) => {
                  const currentType = form.getValues(`actions.${index}.type`);

                  return (
                    <div
                      key={field.id}
                      className="bg-card focus-within:border-primary/50 border-input flex flex-col gap-4 rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex flex-wrap items-start gap-4">
                        {/* Emoji Picker Popover */}
                        <div className="flex flex-col gap-2">
                          <FieldLabel className="text-xs">アイコン</FieldLabel>
                          <Controller
                            name={`actions.${index}.icon`}
                            control={form.control}
                            render={({ field: iconField }) => (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="h-8 w-10 p-0 text-xl"
                                  >
                                    {iconField.value}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-full border-none p-0"
                                  align="start"
                                >
                                  <EmojiPicker
                                    onEmojiClick={(emojiData) =>
                                      iconField.onChange(emojiData.emoji)
                                    }
                                    theme={Theme.AUTO}
                                    emojiStyle={EmojiStyle.NATIVE}
                                    height={350}
                                  />
                                </PopoverContent>
                              </Popover>
                            )}
                          />
                        </div>

                        {/* Action Title */}
                        <div className="min-w-50 flex-1">
                          <Controller
                            name={`actions.${index}.title`}
                            control={form.control}
                            render={({ field: titleField, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-xs">
                                  アクションの名前
                                </FieldLabel>
                                <Input
                                  {...titleField}
                                  placeholder="例: スクワット20回"
                                  className="h-8"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </div>

                        {/* Type Select */}
                        <div>
                          <Controller
                            name={`actions.${index}.type`}
                            control={form.control}
                            render={({ field: typeField }) => (
                              <Field>
                                <FieldLabel className="text-xs">
                                  タイプ
                                </FieldLabel>
                                <Select
                                  onValueChange={typeField.onChange}
                                  defaultValue={typeField.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="p-1">
                                    <SelectItem value="TEXT">
                                      テキスト
                                    </SelectItem>
                                    <SelectItem value="VIDEO">
                                      動画URL
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </Field>
                            )}
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive mt-6 transition-colors"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>

                      <Separator />

                      {/* Dynamic Field (Description or VideoUrl) */}
                      <div>
                        {currentType === "TEXT" ? (
                          <Controller
                            name={`actions.${index}.description`}
                            control={form.control}
                            render={({ field: descField }) => (
                              <Field>
                                <FieldLabel className="flex items-center gap-1 text-[10px]">
                                  <FileText className="size-3" />{" "}
                                  補足説明（任意）
                                </FieldLabel>
                                <Input
                                  {...descField}
                                  placeholder="意識するポイントなど"
                                  className="h-9 text-sm"
                                />
                              </Field>
                            )}
                          />
                        ) : (
                          <Controller
                            name={`actions.${index}.videoUrl`}
                            control={form.control}
                            render={({ field: videoField, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="flex items-center gap-1 text-[10px] text-blue-500">
                                  <Video className="size-3" /> YouTube
                                  URL（必須）
                                </FieldLabel>
                                <Input
                                  {...videoField}
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  className="h-9 border-blue-200 text-sm"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                type="button"
                variant="outline"
                className="hover:bg-primary/5 hover:border-primary/50 group w-full rounded-2xl border-2 border-dashed py-8 transition-all"
                onClick={() =>
                  append({
                    title: "",
                    icon: "✨",
                    type: "TEXT",
                    description: "",
                    videoUrl: "",
                  })
                }
              >
                <Plus className="mr-2 size-5 transition-transform group-hover:scale-125" />
                アクションを追加する
              </Button>
            </div>
          </div>

          <DialogFooter className="bg-background sticky bottom-0 border-t pt-4">
            <Button
              type="submit"
              form="routine-complex-form"
              className="h-12 w-full rounded-xl text-lg font-bold shadow-lg"
              disabled={!form.formState.isValid}
            >
              ルーティンを保存する
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
