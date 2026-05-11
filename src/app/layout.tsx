import LogoutButton from "@/components/auth/logoutButton";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { M_PLUS_1_Code, Noto_Sans_JP } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const sans = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = M_PLUS_1_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IfThenBuddy",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body>
        <div className="container mx-auto flex min-h-full w-full flex-col gap-8 p-8">
          <div className="grid items-center">
            <div className="col-start-1 row-start-1 justify-self-center text-center select-none">
              <h1 className="text-2xl font-black">IfThenBuddy</h1>
              <p className="text-sm">習慣化のお供に</p>
            </div>
            <div className="col-start-1 row-start-1 justify-self-end">
              <LogoutButton />
            </div>
          </div>
          <Separator />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
