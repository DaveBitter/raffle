"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import { QRCodeSVG } from "qrcode.react";
import { getSocket } from "@/src/utils/socket";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { Participant } from "@/src/types/raffle";
import { ParticipantsGrid } from "@/src/components/ParticipantsGrid/ParticipantsGrid";
import { config } from "@/config";

export default function RaffleOverview({
  params,
}: {
  children: ReactNode;
  params: any;
}) {
  const socket = useMemo(() => getSocket(), []);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [state, setState] = useState<"INITIAL" | "PICKING" | "PICKED">(
    "INITIAL"
  );
  const [winners, setWinners] = useState<Participant[]>([]);
  const [potentialWinner, setPotentialWinner] = useState<
    Participant | undefined
  >(undefined);
  const { raffleId } = params;

  useEffect(() => {
    socket.on(
      `updated-participants-raffle-${raffleId}`,
      (data: Participant[]) => {
        setParticipants(data);
      }
    );

    socket.on(`raffle_winner_${raffleId}`, (data: Participant) => {
      setState("PICKED");
      setWinners([...winners, data]);
    });

    socket.emit("emit_raffle_participants", { raffleId });
  }, []);

  const pickWinner = () => {
    setState("PICKING");

    const getRandomName = (participants: Participant[]) =>
      participants[Math.floor(Math.random() * participants.length)];

    const nameInterval = setInterval(() => {
      setPotentialWinner(getRandomName(participants));
    }, 50);
    setTimeout(() => {
      clearInterval(nameInterval);
      setPotentialWinner(undefined);
      socket.emit(`pick_raffle_winner`, { raffleId });
    }, 5000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 justify-center p-12">
      {state === "INITIAL" && (
        <>
          <h1 className="text-5xl uppercase tracking-widest">scan to enter</h1>
          <QRCodeSVG
            size={256}
            fgColor="white"
            bgColor="transparent"
            value={`${config.clientUrl}/raffle/${raffleId}/join`}
          />
        </>
      )}
      <ParticipantsGrid
        participants={participants}
        potentialWinner={potentialWinner}
        winners={winners}
      />
      {state !== "PICKING" && (
        <Button
          role="a"
          size="4"
          variant="surface"
          highContrast
          onClick={pickWinner}
        >
          <MagicWandIcon width="16" height="16" />
          {state === "INITIAL" ? "Pick winner" : "Pick another winner"}
        </Button>
      )}
    </div>
  );
}
