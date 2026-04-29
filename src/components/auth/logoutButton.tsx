"use client";
import { logout } from "@/app/actions";
import { useAction } from "next-safe-action/hooks";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { execute: handleLogout } = useAction(logout, {
    onSuccess: () => {
      router.push("/login");
    },
  });

  return (
    <>
      {pathname !== "/login" && (
        <Button variant="ghost" onClick={() => handleLogout()}>
          LOGOUT
        </Button>
      )}
    </>
  );
}
