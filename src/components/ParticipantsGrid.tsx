import {Participant} from "@/src/types/raffle";
import {useMemo} from "react";

const GRID_ROWS = 10;
const GRID_COLS = 5;

const rowAreas = Array.from({length: GRID_ROWS}, (_, i) => i + 1)
const columnAreas = Array.from({length: GRID_COLS}, (_, i) => i + 1)

export const ParticipantsGrid = ({participants}: { participants: Participant[] }) => {
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
    // rowAreas.splice(randomRowPicker, 1)
    const col = columnAreas[randomColumnPicker]
    // columnAreas.splice(randomColumnPicker, 1)

    return `${row}/${col}`;
}