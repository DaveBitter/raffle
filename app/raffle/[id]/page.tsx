"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { QRCodeSVG } from "qrcode.react";

export default function RaffleOverview({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 justify-center p-12">
      <h1 className="text-5xl">Join the raffle</h1>
      <QRCodeSVG
        size={512}
        fgColor="black"
        bgColor="gray"
        value={`${
          typeof window !== "undefined" ? window.location.href : ""
        }/join`}
      />
      {children}
    </div>
  );
}
