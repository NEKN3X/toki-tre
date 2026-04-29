"use client";
import { Icons } from "@/components/auth/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "../actions";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { execute: handleLogout } = useAction(logout, {
    onSuccess: () => {
      router.push("/login");
    },
  });

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setIsLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    setIsLoading(false);
  };

  const handleGithubLogin = async () => {
    const supabase = createClient();
    setIsLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    setIsLoading(false);
  };

  const handleDemoLogin = async () => {
    const supabase = createClient();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: "demo@example.com",
      password: "demo",
    });
    setIsLoading(false);
    if (error) {
      console.error(`Demo login error: ${error.message}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center pt-8">
      <Card className="w-full max-w-md gap-6 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-bold">
            アカウントにログイン
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col gap-4">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Icons provider="google" />
              Google でログイン
            </Button>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={handleGithubLogin}
              disabled={isLoading}
            >
              <Icons provider="github" />
              GitHub でログイン
            </Button>
            <Separator />
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => handleLogout()}
            >
              ログアウト
            </Button>
            <Button className="cursor-pointer" onClick={handleDemoLogin}>
              デモアカウントでログイン
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
