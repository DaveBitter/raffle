import io from "socket.io-client";

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://ws-raffle.davebitter.com";
let socket;

export const getSocket = () => {
  console.log(url);
  if (!socket) {
    socket = io(url);
  }
  return socket;
};
