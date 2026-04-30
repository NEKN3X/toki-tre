"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const logout = actionClient.action(async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Logout failed");
  }

  revalidatePath("/", "layout");
  redirect("/login");
});

export const googleLogin = actionClient.action(async () => {
  const supabase = await createClient();

  const redirectTo = `${getBaseUrl()}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw new Error("Google login failed");
  }

  if (data?.url) {
    redirect(data.url);
  }
});

export const demoLogin = actionClient.action(async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: "demo@example.com",
    password: "demo",
  });

  if (error) {
    throw new Error("Demo login failed");
  }

  redirect("/");
});
