"use client";
import * as z from "zod";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "ルーティン名を入力してください")
    .max(32, "ルーティン名は32文字以内で入力してください"),
});

export function AddRoutineDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Saving routine:", data.title);
    setOpen(false);
    form.reset();
  }

  return (
    <TooltipProvider>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) form.reset();
        }}
      >
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <div className="fixed right-8 bottom-8 z-50">
                <Button
                  size="icon"
                  className="bg-primary text-primary-foreground flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-transform hover:scale-110 active:scale-95"
                >
                  <Plus className="size-8" strokeWidth={3} />
                </Button>
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="left" className="mr-0 font-bold">
            新しいルーティンを追加
          </TooltipContent>
        </Tooltip>

        <DialogContent className="rounded-2xl sm:max-w-md">
          <form id="add-routine-form" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                新しいルーティン
              </DialogTitle>
              <DialogDescription>
                今日から始める新しい習慣を決めましょう
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="routine-title">
                        ルーティン名
                      </FieldLabel>
                      <Input
                        {...field}
                        id="routine-title"
                        placeholder="例: 朝起きたらすぐ、夜寝る前に"
                        autoComplete="off"
                        autoFocus
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                form="add-routine-form"
                className="w-full px-8 font-bold sm:w-auto"
                disabled={!form.formState.isValid}
              >
                作成する
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
