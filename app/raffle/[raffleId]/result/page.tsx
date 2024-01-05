"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import { Button, Card, Text, TextField } from "@radix-ui/themes";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { getSocket } from "@/src/utils/socket";

export default function RaffleResult({ params }) {
  const socket = useMemo(() => getSocket(), []);

  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const { raffleId } = params;

    socket.on(`updated-participants-raffle-${raffleId}`, (data) => {
      setParticipants(data);
    });

    socket.on(`raffle_winner_${raffleId}`, (data) => {
      setWinner(data);
    });

    socket.emit("emit_raffle_participants", { raffleId });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 justify-center p-12">
      <Card className="max-w-full w-96">
        {!winner && !!participants.length && (
          <p>Competing against {participants.length - 1} participants</p>
        )}
        {winner && (
          <>
            {winner?.socketId === socket.id ? (
              <p>You won!</p>
            ) : (
              <p>{winner?.name} won</p>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
