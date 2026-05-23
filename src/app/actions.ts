"use server";

import { prisma } from "@/lib/db";
import { authClient } from "@/lib/safe-action";
import { routineSchema, routineWithIdSchema } from "@/lib/schema";
import { updateTag } from "next/cache";
import z from "zod";

export const createRoutine = authClient
  .inputSchema(routineSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.routine.create({
      data: {
        title: parsedInput.title,
        icon: parsedInput.icon,
        description: parsedInput.description,
        userId: ctx.user.id,
        steps: {
          create: parsedInput.steps.map((step, index) => ({
            ...step,
            order: index,
          })),
        },
      },
    });
    updateTag("routines");
    return { success: true };
  });

const routineIdSchema = z.object({ id: z.string() });
export const deleteRoutine = authClient
  .inputSchema(routineIdSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.routine.delete({
      where: {
        id: parsedInput.id,
        userId: ctx.user.id,
      },
    });
    updateTag("routines");
    return { success: true };
  });

export const updateRoutine = authClient
  .inputSchema(routineWithIdSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.$transaction(async (tx) => {
      await tx.routine.update({
        where: {
          id: parsedInput.id,
          userId: ctx.user.id,
        },
        data: {
          title: parsedInput.title,
          icon: parsedInput.icon,
          description: parsedInput.description,
          steps: {
            deleteMany: {
              routineId: parsedInput.id,
            },
            create: parsedInput.steps.map((step, index) => ({
              ...step,
              description: step.type === "TEXT" ? step.description : undefined,
              videoUrl: step.type === "VIDEO" ? step.videoUrl : undefined,
              order: index,
            })),
          },
        },
      });
    });
    updateTag("routines");
    return { success: true };
  });
