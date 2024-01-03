"use client";

import { ReactNode } from "react";

import { Button, Card, Text, TextField } from "@radix-ui/themes";
import { MagicWandIcon } from "@radix-ui/react-icons";

import { join } from "./actions.ts";

export default function RaffleJoin({ params }) {
  return (
    <form
      className="flex min-h-screen flex-col items-center gap-8 justify-center p-12"
      action={join}
      method="POST"
    >
      <input type="hidden" name="id" value={params.id} />
      <Card className="max-w-full w-96">
        <div className="flex flex-col justify-stretch items-stretch gap-8">
          <Text as="label" size="2" className="flex flex-col gap-4">
            Your name
            <TextField.Input
              variant="soft"
              placeholder="Name"
              size="3"
              required
              autoFocus
              name="name"
            />
          </Text>

          <Button type="submit" size="4">
            <MagicWandIcon width="16" height="16" /> Join
          </Button>
        </div>
      </Card>
    </form>
  );
}
