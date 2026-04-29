"use server";

import { prisma } from "@/lib/db";
import { actionClient, authClient } from "@/lib/safe-action";
import { routineSchema } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { updateTag } from "next/cache";

export const createRoutine = authClient
  .inputSchema(routineSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.routine.create({
      data: {
        title: parsedInput.title,
        icon: parsedInput.icon,
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

export const logout = actionClient.action(async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const url = new URL("/login", process.env.NEXT_PUBLIC_SITE_URL);
  return { redirect: url.href };
});
