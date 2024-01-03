"use client";

import { ReactNode } from "react";

import { Button, Card, Text, TextField } from "@radix-ui/themes";
import { MagicWandIcon } from "@radix-ui/react-icons";

export default function RaffleResult() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 justify-center p-12">
      <Card className="max-w-full w-96">
        <p>Waiting for the raffle to start...</p>
      </Card>
    </div>
  );
}
