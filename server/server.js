const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();

const raffles = {};

const io = new Server(httpServer, {
    cors: {
        origin: [process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:8000", "https://raffle.davebitter.com"]
    },
});

io.on("connection", (socket) => {
    socket.on("emit_raffle_participants", ({raffleId}) => {
        io.emit(
            `updated-participants-raffle-${raffleId}`,
            raffles[raffleId]?.participants || []
        );
    });

    socket.on("join_raffle", ({raffleId, name, userId}) => {
        console.log(raffleId);
        if (!raffles[raffleId]) {
            raffles[raffleId] = {
                participants: [],
            };
        }

        if (
            raffles[raffleId]?.participants?.find(
                (participant) => participant.userId === userId
            )
        ) {
            raffles[raffleId] = raffles[raffleId].participants.map((participant) => {
                if (participant.userId === userId) {
                    return {...participant, socketId: socket.id};
                }

                return participant;
            });
        } else {
            raffles[raffleId]?.participants?.push({
                name,
                userId,
                socketId: socket.id,
            });
        }

        socket.join(raffleId);
        console.log(
            `user with [socket-id]-${socket.id}, [user-id]-${userId} and [name]-${name} joined [raffle]-${raffleId} with ${raffles[raffleId].length} participants`
        );

        io.emit(
            `updated-participants-raffle-${raffleId}`,
            raffles[raffleId].participants
        );
    });

    socket.on("pick_raffle_winner", ({raffleId}) => {
        const raffleParticipants = raffles[raffleId]?.participants;

        if (raffleParticipants && !!raffleParticipants.length) {
            const winnerIndex = Math.floor(Math.random() * raffleParticipants.length);
            const winner = raffleParticipants[winnerIndex];
            console.log("pick_raffle_winner", raffleId, winner);
            io.emit(`raffle_winner_${raffleId}`, winner);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`Socket.io server is running on port ${PORT}`);
});
