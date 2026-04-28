"use server";

import { prisma } from "@/lib/db";
import { authClient } from "@/lib/safe-action";
import { routineSchema } from "@/lib/schema";
import { updateTag } from "next/cache";

export const createRoutine = authClient
  .inputSchema(routineSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.routine.create({
      data: {
        title: parsedInput.title,
        userId: ctx.user.id,
        steps: {
          create: parsedInput.steps.map((step, index) => ({
            title: step.title,
            icon: step.icon,
            type: step.type,
            description: step.description,
            videoUrl: step.videoUrl,
            order: index,
          })),
        },
      },
    });
    updateTag("routines");
    return { success: true };
  });
