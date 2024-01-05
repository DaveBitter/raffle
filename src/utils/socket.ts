import io from "socket.io-client";

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://5d88-78-108-140-58.ngrok-free.app";
let socket;

export const getSocket = () => {
  console.log(url);
  if (!socket) {
    socket = io(url);
  }
  return socket;
};
