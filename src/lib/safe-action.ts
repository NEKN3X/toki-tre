import { createSafeActionClient } from "next-safe-action";
import { createClient } from "./supabase/server";

export const actionClient = createSafeActionClient();

export const authClient = actionClient.use(async ({ next }) => {
  const supabase = await createClient();
  const session = await supabase.auth.getUser();

  if (!session?.data.user) {
    throw new Error("Not authenticated");
  }

  // Pass user data to the next layer via ctx
  return next({ ctx: { user: session.data.user } });
});
