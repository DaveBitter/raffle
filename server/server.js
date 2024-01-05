const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();

const raffles = {};

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("emit_raffle_participants", ({ raffleId }) => {
    io.emit(`updated-participants-raffle-${raffleId}`, raffles[raffleId] || []);
  });

  socket.on("join_raffle", ({ raffleId, name, uuid }) => {
    if (!raffles[raffleId]) {
      raffles[raffleId] = [];
    }

    raffles[raffleId].push({ name, uuid, socketId: socket.id });

    socket.join(raffleId);
    console.log(
      `user with [socket-id]-${socket.id} and [name]-${name} joined [raffle]-${raffleId} with ${raffles[raffleId].length} participants`
    );

    io.emit(`updated-participants-raffle-${raffleId}`, raffles[raffleId]);
  });

  socket.on("pick_raffle_winner", ({ raffleId }) => {
    console.log("pick_raffle_winner", raffleId);
    const raffleParticipants = raffles[raffleId];

    if (raffleParticipants && !!raffleParticipants.length) {
      const winnerIndex = Math.floor(Math.random() * raffleParticipants.length);
      const winner = raffleParticipants[winnerIndex];

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
