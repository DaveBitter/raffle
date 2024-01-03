"use client";

import { MagicWandIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { hri } from "human-readable-ids";

export default function Raffle() {
  const id = hri.random();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <Link href={`/raffle/${id}`}>
        <Button role="a" size="4">
          <MagicWandIcon width="16" height="16" /> Start new Raffle
        </Button>
      </Link>
    </main>
  );
}
