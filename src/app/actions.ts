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
        actions: {
          create: parsedInput.actions.map((action, index) => ({
            title: action.title,
            icon: action.icon,
            type: action.type,
            description: action.description,
            videoUrl: action.videoUrl,
            order: index,
          })),
        },
      },
    });
    updateTag("routines");
    return { success: true };
  });
