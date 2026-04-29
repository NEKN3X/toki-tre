import { updateRoutine } from "@/app/actions";
import { routineWithIdSchema } from "@/lib/schema";
import { Routine } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { FileText, Plus, Trash2, Video } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";

interface StepDynamicFieldsProps {
  control: Control<z.infer<typeof routineWithIdSchema>>;
  index: number;
}

function StepDynamicFields({ control, index }: StepDynamicFieldsProps) {
  const currentType = useWatch({
    control,
    name: `steps.${index}.type`,
  });

  return (
    <div>
      <Controller
        name={`steps.${index}.description`}
        control={control}
        render={({ field: descField, fieldState }) => (
          <Field hidden={currentType !== "TEXT"}>
            <div className="flex justify-between">
              <FieldLabel className="flex gap-1 text-xs">
                <FileText className="size-3" /> このステップの説明（任意）
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
            <Input {...descField} placeholder="意識するポイントなど" />
          </Field>
        )}
      />
      <Controller
        name={`steps.${index}.videoUrl`}
        control={control}
        render={({ field: videoField, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            hidden={currentType !== "VIDEO"}
          >
            <div className="flex justify-between">
              <FieldLabel className="flex items-center justify-center gap-1 text-xs">
                <Video className="size-3" /> YouTube URL（必須）
              </FieldLabel>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-xs" />
              )}
            </div>
            <Input
              {...videoField}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Field>
        )}
      />
    </div>
  );
}

interface RoutineFormProps {
  routine?: Routine;
  title: string;
  onSubmit?: () => void;
  description: string;
  submitLabel: string;
}

export function RoutineForm({
  routine,
  title,
  onSubmit,
  description,
  submitLabel,
}: RoutineFormProps) {
  const form = useForm<z.infer<typeof routineWithIdSchema>>({
    resolver: zodResolver(routineWithIdSchema),
    defaultValues: {
      ...routine,
      description: routine?.description || "",
      steps: routine?.steps.map((s) => ({
        ...s,
        description: s.description || "",
        videoUrl: s.videoUrl || "",
      })),
    },
  });
  const { execute, isExecuting } = useAction(updateRoutine, {
    onSuccess: () => {
      form.reset();
      onSubmit?.();
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  return (
    <form onSubmit={form.handleSubmit(execute)} className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4">
            <Controller
              name="icon"
              control={form.control}
              render={({ field: routineIconField }) => (
                <Field className="w-14">
                  <FieldLabel>アイコン</FieldLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 w-full p-0 text-2xl"
                      >
                        {routineIconField.value}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-full border-none p-0"
                      align="start"
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiData) =>
                          routineIconField.onChange(emojiData.emoji)
                        }
                        theme={Theme.AUTO}
                        emojiStyle={EmojiStyle.NATIVE}
                        height={400}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              )}
            />

            <div className="flex-1">
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
                      className="h-10"
                      placeholder="例: 朝起きたらすぐに、夜寝る前に"
                    />
                  </Field>
                )}
              />
            </div>
          </div>

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <div className="flex justify-between">
                  <FieldLabel>このルーティンの説明（任意）</FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </div>

                <Input
                  {...field}
                  placeholder="例: 最高の1日を始めるための5分間"
                />
              </Field>
            )}
          />
        </div>

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
                <div className="flex flex-wrap items-start gap-2 sm:gap-4">
                  {/* Emoji Picker Popover */}

                  <div className="flex flex-col gap-2">
                    <FieldLabel className="text-xs">アイコン</FieldLabel>

                    <Controller
                      name={`steps.${index}.icon`}
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

                  {/* Step Title */}

                  <div className="flex-1">
                    <Controller
                      name={`steps.${index}.title`}
                      control={form.control}
                      render={({ field: titleField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex justify-between">
                            <FieldLabel className="text-xs">
                              ステップの名前
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
                      name={`steps.${index}.type`}
                      control={form.control}
                      render={({ field: typeField }) => (
                        <Field>
                          <FieldLabel className="text-xs">タイプ</FieldLabel>

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
                <StepDynamicFields control={form.control} index={index} />
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
            ステップを追加する
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="submit"
          className="w-full font-bold"
          disabled={isExecuting}
        >
          {isExecuting ? <Spinner data-icon="inline-start" /> : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
