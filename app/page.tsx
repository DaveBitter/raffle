"use client";

import { MagicWandIcon } from "@radix-ui/react-icons";
import { Button, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { hri } from "human-readable-ids";

export default function Home() {
  const id = hri.random();

  return (
    <main className="flex min-h-screen flex-col gap-96 items-center justify-center p-12">
      <div className="flex flex-col gap-4">
        <Heading
          as="h1"
          size="9"
          weight="medium"
          className="text-center  uppercase tracking-widest"
        >
          Raffle
        </Heading>
        <Text as="p" size="3" weight="light" className="text-center">
          A product by{" "}
          <a
            href="https://davebitter.com"
            target="__blank"
            className="text-indigo-300 font-bold"
          >
            Dave Bitter
          </a>{" "}
          and{" "}
          <a
            href="https://stevejonk.com/"
            target="__blank"
            className="text-indigo-300 font-bold"
          >
            Steve Jonk
          </a>
        </Text>
      </div>
      <Link href={`/raffle/${id}`}>
        <Button role="a" size="4" variant="surface" highContrast>
          <MagicWandIcon width="16" height="16" /> Start new Raffle
        </Button>
      </Link>
    </main>
  );
}
