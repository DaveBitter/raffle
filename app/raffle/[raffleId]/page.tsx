"use client";

import {ReactNode, useEffect, useMemo, useState} from "react";
import {usePathname} from "next/navigation";

import {QRCodeSVG} from "qrcode.react";
import {getSocket} from "@/src/utils/socket";
import {MagicWandIcon} from "@radix-ui/react-icons";
import {Button} from "@radix-ui/themes";
import {Participant} from "@/src/types/raffle";
import {ParticipantsGrid} from "@/src/components/ParticipantsGrid";

export default function RaffleOverview({params}: {
    children: ReactNode;
    params: any
}) {
    const socket = useMemo(() => getSocket(), []);

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [winner, setWinner] = useState<Participant | null>(null);

    useEffect(() => {
        const {raffleId} = params;

        socket.on(`updated-participants-raffle-${raffleId}`, (data: Participant[]) => {
            setParticipants(data);
        });

        socket.on(`raffle_winner_${raffleId}`, (data: Participant) => {
            setWinner(data);
        });

        socket.emit("emit_raffle_participants", {raffleId});
    }, []);

    const handlePickWinner = () => {
        const {raffleId} = params;

        socket.emit(`pick_raffle_winner`, {raffleId});
    };

    if (Boolean(winner)) return (
        <div className="flex min-h-screen flex-col items-center gap-8 justify-center p-12"><p
            className="text-5xl">{winner?.name} won!</p>
            <Button role="a" size="4" onClick={handlePickWinner}>
                <MagicWandIcon width="16" height="16"/> Pick another winner
            </Button></div>
    )

    return (
        <div className="flex min-h-screen flex-col items-center gap-8 justify-center p-12">
            <h1 className="text-5xl">Join the raffle</h1>
            <QRCodeSVG
                size={420}
                fgColor="black"
                bgColor="gray"
                value={`${
                    typeof window !== "undefined" ? window.location.href : ""
                }/join`}
            />
            <Button role="a" size="4" onClick={handlePickWinner}>
                <MagicWandIcon width="16" height="16"/> Pick random winner
            </Button>
            <h2 className="text-2xl">Who joined?</h2>
            <ParticipantsGrid participants={participants}/>
        </div>
    );
}

