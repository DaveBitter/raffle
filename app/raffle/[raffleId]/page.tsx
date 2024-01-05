"use client";

import {ReactNode, useEffect, useMemo, useState} from "react";
import {usePathname} from "next/navigation";

import {QRCodeSVG} from "qrcode.react";
import {getSocket} from "@/src/utils/socket";
import {MagicWandIcon} from "@radix-ui/react-icons";
import {Button} from "@radix-ui/themes";
import {Participant} from "@/src/types/raffle";

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
            {winner ? (
                <p className="text-2xl">{winner.name} won!</p>
            ) : (
                <>
                    <h2 className="text-2xl">Who joined?</h2>
                    <ParticipantsGrid participants={participants}/>
                </>
            )}
        </div>
    );
}

const GRID_ROWS = 10;
const GRID_COLS = 5;

const rowAreas = Array.from({length: GRID_ROWS}, (_, i) => i + 1)
const columnAreas = Array.from({length: GRID_COLS}, (_, i) => i + 1)

const ParticipantsGrid = ({participants}: { participants: Participant[] }) => {
    const participantsMap = useMemo(() => {
        return participants.map((participant) => ({
            ...participant,
            gridArea: getRandomGridArea()
        }))
    }, [participants.length]);

    return (
        <div
            className={`border-2 rounded-2xl p-4 grid grid-cols-${GRID_COLS} grid-rows-${GRID_ROWS} gap-2 w-full h-[400px]`}>
            {participantsMap.map(({socketId, name, gridArea}) => (
                <div key={socketId} style={{gridArea}}>{name}</div>
            ))}
        </div>
    );
}

const getRandomGridArea = () => {
    const randomRowPicker = Math.floor(Math.random() * rowAreas.length)
    const randomColumnPicker = Math.floor(Math.random() * columnAreas.length)

    const row = rowAreas[randomRowPicker]
    rowAreas.splice(randomRowPicker, 1)
    const col = columnAreas[randomColumnPicker]
    columnAreas.splice(randomColumnPicker, 1)

    return `${row}/${col}`;
}