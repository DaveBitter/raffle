"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import { QRCodeSVG } from "qrcode.react";
import { getSocket } from "@/src/utils/socket";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { Participant } from "@/src/types/raffle";
import { ParticipantsGrid } from "@/src/components/ParticipantsGrid";
import { config } from "@/config";

export default function RaffleOverview({
  params,
}: {
  children: ReactNode;
  params: any;
}) {
  const socket = useMemo(() => getSocket(), []);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isRaffling, setIsRaffling] = useState<boolean>(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const { raffleId } = params;

  useEffect(() => {
    socket.on(
      `updated-participants-raffle-${raffleId}`,
      (data: Participant[]) => {
        setParticipants(data);
      }
    );

    socket.on(`raffle_winner_${raffleId}`, (data: Participant) => {
      setWinner(data);
    });

    socket.emit("emit_raffle_participants", { raffleId });
  }, []);

  if (isRaffling)
    return (
      <div className="flex min-h-screen flex-col items-center gap-8 justify-center p-12">
        <Winner
          realWinner={winner}
          participants={participants}
          onPickWinner={() => {
            socket.emit(`pick_raffle_winner`, { raffleId: params.raffleId });
          }}
        />
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 justify-center p-12">
      <h1 className="text-5xl">Join the raffle</h1>
      <QRCodeSVG
        size={420}
        fgColor="black"
        bgColor="gray"
        value={`${config.clientUrl}/raffle/${raffleId}/join`}
      />
      <Button role="a" size="4" onClick={() => setIsRaffling(true)}>
        <MagicWandIcon width="16" height="16" /> Pick random winner
      </Button>
      <h2 className="text-2xl">Who joined?</h2>
      <ParticipantsGrid participants={participants} />
    </div>
  );
}

const Winner = ({
  realWinner,
  participants,
  onPickWinner,
}: {
  realWinner: Participant | null;
  participants: Participant[];
  onPickWinner: () => void;
}) => {
  const [winner, setWinner] = useState<Participant>(
    getRandomName(participants)
  );

  useEffect(() => {
    const nameInterval = setInterval(() => {
      setWinner(getRandomName(participants));
    }, 50);
    setTimeout(() => {
      clearInterval(nameInterval);
      onPickWinner();
    }, 5000);
    return () => clearInterval(nameInterval);
  }, []);

  useEffect(() => {
    if (realWinner) {
      setWinner(realWinner);
    }
  }, [realWinner]);

  return (
    <div>
      <p className="text-5xl">
        {winner?.name} {realWinner && "won!"}
      </p>
    </div>
  );
};

const getRandomName = (participants: Participant[]) =>
  participants[Math.floor(Math.random() * participants.length)];
