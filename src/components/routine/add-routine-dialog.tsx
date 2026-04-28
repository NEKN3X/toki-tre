"use client";

import * as z from "zod";
import { createRoutine } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { routineSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { FileText, Plus, Trash2, Video } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import type { Control } from "react-hook-form";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Separator } from "../ui/separator";

export default function AddRoutineDialog() {
  const [open, setOpen] = useState(false);
  const { execute } = useAction(createRoutine, {
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

  const form = useForm<z.infer<typeof routineSchema>>({
    resolver: zodResolver(routineSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      actions: [{ title: "", icon: "🏋️", type: "TEXT", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "actions",
  });

  interface ActionDynamicFieldsProps {
    control: Control<z.infer<typeof routineSchema>>;
    index: number;
  }

  function ActionDynamicFields({ control, index }: ActionDynamicFieldsProps) {
    const currentType = useWatch({
      control,
      name: `actions.${index}.type`,
    });

    return (
      <div>
        {currentType === "TEXT" ? (
          <Controller
            name={`actions.${index}.description`}
            control={control}
            render={({ field: descField }) => (
              <Field>
                <FieldLabel className="flex gap-1 text-xs">
                  <FileText className="size-3" /> 補足説明（任意）
                </FieldLabel>
                <Input {...descField} placeholder="意識するポイントなど" />
              </Field>
            )}
          />
        ) : (
          <Controller
            name={`actions.${index}.videoUrl`}
            control={control}
            render={({ field: videoField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex justify-between">
                  <FieldLabel className="flex items-center justify-center gap-1 text-xs">
                    <Video className="size-3" /> YouTube URL（必須）
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-xs"
                    />
                  )}
                </div>
                <Input
                  {...videoField}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </Field>
            )}
          />
        )}
      </div>
    );
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
          onSubmit={form.handleSubmit((data) => execute(data))}
          className="flex flex-col gap-6"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              新しいルーティンを作成する
            </DialogTitle>
            <DialogDescription>
              繰り返したい行動を宣言しましょう
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            {/* Routine Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex justify-between">
                    <FieldLabel>ルーティンの名前</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                  <Input
                    {...field}
                    placeholder="例: 朝起きたらすぐに、夜寝る前に"
                  />
                </Field>
              )}
            />

            {/* Actions List */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">ステップ</h3>
                <span className="text-muted-foreground text-xs">
                  {fields.length} ステップ
                </span>
              </div>

              <div className="flex max-h-100 flex-col gap-2 overflow-y-auto">
                {fields.map((field, index) => (
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
                                  height={500}
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
                              <div className="flex justify-between">
                                <FieldLabel className="text-xs">
                                  アクションの名前
                                </FieldLabel>
                                {fieldState.invalid && (
                                  <FieldError
                                    errors={[fieldState.error]}
                                    className="text-xs"
                                  />
                                )}
                              </div>
                              <Input
                                {...titleField}
                                placeholder="例: スクワット20回"
                              />
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
                                  <SelectItem value="TEXT">テキスト</SelectItem>
                                  <SelectItem value="VIDEO">動画URL</SelectItem>
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
                    <ActionDynamicFields control={form.control} index={index} />
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="hover:bg-primary/5 hover:border-primary/50 h-16 w-full rounded-lg border-2 border-dashed transition-all"
                onClick={() =>
                  append({
                    title: "",
                    icon: "🏋️",
                    type: "TEXT",
                    description: "",
                    videoUrl: "",
                  })
                }
              >
                <Plus className="size-5 transition-transform" />
                アクションを追加する
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              form="routine-complex-form"
              className="h-12 w-full rounded-lg text-lg font-bold"
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
