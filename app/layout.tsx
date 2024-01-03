"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ReactNode } from "react";
import { SiteMeta } from "@/src/components/SiteMeta/SIteMeta";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <SiteMeta />
      </head>
      <body>
        <Theme hasBackground={false} appearance="dark" accentColor="iris">
          <div className="bg-black">{children}</div>
        </Theme>
      </body>
    </html>
  );
}
