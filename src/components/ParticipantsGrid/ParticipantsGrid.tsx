import { Participant } from "@/src/types/raffle";
import { useMemo } from "react";
import { Card } from "@radix-ui/themes";

const GRID_ROWS = 15;
const GRID_COLS = 10;

const getRandomJustifySelf = () => {
  const justifySelfValues = ["start", "end", "center"];
  return justifySelfValues[
    Math.floor(Math.random() * justifySelfValues.length)
  ];
};

export const ParticipantsGrid = ({
  participants,
  potentialWinner,
  winners,
}: {
  participants: Participant[];
  potentialWinner?: Participant;
  winners: Participant[];
}) => {
  const participantsMap = useMemo(() => {
    const rowAreas = Array.from({ length: GRID_ROWS }, (_, i) => i + 1);
    const columnAreas = Array.from({ length: GRID_COLS }, (_, i) => i + 1);
    const usedGridAreas = new Set();

    let updatedParticipants = [];

    for (let i = 0; i < participants.length; i++) {
      let randomRowPicker, randomColumnPicker, row, col, gridArea;

      do {
        randomRowPicker = Math.floor(Math.random() * rowAreas.length);
        randomColumnPicker = Math.floor(Math.random() * columnAreas.length);
        row = rowAreas[randomRowPicker];
        col = columnAreas[randomColumnPicker];
        gridArea = `${row}/${col}`;
      } while (usedGridAreas.has(gridArea));

      usedGridAreas.add(gridArea);

      updatedParticipants.push({
        ...participants[i],
        gridArea,
        justifySelf: getRandomJustifySelf(),
      });
    }

    return updatedParticipants;
  }, [participants.length]);

  return (
    <div
      className={`rounded-2xl p-4 grid grid-cols-${GRID_COLS} grid-rows-${GRID_ROWS} gap-2 w-full`}
    >
      {participantsMap.map(
        ({ socketId, userId, name, gridArea, justifySelf }) => {
          const isWinner = winners.find((winner) => winner.userId === userId);
          const isPotentialWinner = potentialWinner?.userId === userId;
          return (
            <Card
              style={{
                gridArea,
                justifySelf,
                backgroundColor:
                  isWinner || isPotentialWinner ? "#6366F1" : undefined,
              }}
              variant="surface"
              key={socketId}
            >
              <div
                className={`text-center truncate max-w-36 ${
                  isWinner || isPotentialWinner
                    ? "text-white"
                    : "text-indigo-300"
                }`}
              >
                {name} {isWinner && "won!"}
              </div>
            </Card>
          );
        }
      )}
    </div>
  );
};
