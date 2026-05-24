"use client";

import { SocialIcon } from "@/components/auth/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAction } from "next-safe-action/hooks";
import { logout } from "@/app/actions";
import { demoLogin, googleLogin } from "./actions";

export default function Home() {
  const { execute: handleLogout, isExecuting: isExecutingLogout } =
    useAction(logout);
  const { execute: handleGoogleLogin, isExecuting: isExecutingGoogleLogin } =
    useAction(googleLogin);
  const { execute: handleDemoLogin, isExecuting: isExecutingDemoLogin } =
    useAction(demoLogin);

  const isExecuting =
    isExecutingLogout || isExecutingGoogleLogin || isExecutingDemoLogin;

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
              onClick={() => handleGoogleLogin()}
              disabled={isExecuting}
            >
              <SocialIcon provider="google" />
              Google でログイン
            </Button>
            <Separator />
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => handleLogout()}
              disabled={isExecuting}
            >
              ログアウト
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => handleDemoLogin()}
              disabled={isExecuting}
            >
              デモアカウントでログイン
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
