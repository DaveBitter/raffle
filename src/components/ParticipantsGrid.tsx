import {Participant} from "@/src/types/raffle";
import {useMemo} from "react";

const GRID_ROWS = 10;
const GRID_COLS = 5;

export const ParticipantsGrid = ({participants}: { participants: Participant[] }) => {
    const participantsMap = useMemo(() => {
        const rowAreas = Array.from({length: GRID_ROWS}, (_, i) => i + 1)
        const columnAreas = Array.from({length: GRID_COLS}, (_, i) => i + 1)

        return participants.map((participant) => {
            const randomRowPicker = Math.floor(Math.random() * rowAreas.length)
            const randomColumnPicker = Math.floor(Math.random() * columnAreas.length)
            const row = rowAreas[randomRowPicker]
            const col = columnAreas[randomColumnPicker]
            rowAreas.splice(randomRowPicker, 1)
            columnAreas.splice(randomColumnPicker, 1)

            return ({
                ...participant,
                gridArea: `${row}/${col}`
            })
        })
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

