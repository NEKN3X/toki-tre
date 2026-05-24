"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FileText, Video } from "lucide-react";
import {
  Control,
  Controller,
  type FieldValues,
  type Path,
  useWatch,
} from "react-hook-form";

export function StepDynamicFields<TFieldValues extends FieldValues>({
  control,
  index,
}: {
  control: Control<TFieldValues>;
  index: number;
}) {
  const currentType = useWatch({
    control,
    name: `steps.${index}.type` as Path<TFieldValues>,
  }) as string;

  return (
    <div>
      <Controller
        name={`steps.${index}.description` as Path<TFieldValues>}
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
        name={`steps.${index}.videoUrl` as Path<TFieldValues>}
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
