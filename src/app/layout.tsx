import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { M_PLUS_1_Code, Noto_Sans_JP } from "next/font/google";
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
  title: "Toki-Tre",
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
          <div className="text-center">
            <h1 className="text-2xl font-black text-blue-600">SceneDo</h1>
            <p className="text-blue-600 opacity-70">Make your flow.</p>
          </div>
          <Separator />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
