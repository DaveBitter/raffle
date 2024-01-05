"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { QRCodeSVG } from "qrcode.react";
import { getSocket } from "@/src/utils/socket";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";

export default function RaffleOverview({
  children,
  params,
}: {
  children: ReactNode;
}) {
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

  const handlePickWinner = () => {
    const { raffleId } = params;

    socket.emit(`pick_raffle_winner`, { raffleId });
  };

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
      <Button role="a" size="4" onClick={handlePickWinner}>
        <MagicWandIcon width="16" height="16" /> Pick random winner
      </Button>
      {winner ? (
        <p>{winner.name}</p>
      ) : (
        <ul>
          {participants.map(({ socketId, name }) => (
            <li key={socketId}>{name}</li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}
