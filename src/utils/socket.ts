import io from "socket.io-client";

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://m1dm5fln-3001.euw.devtunnels.ms";
let socket;

export const getSocket = () => {
  console.log(url);
  if (!socket) {
    socket = io(url);
  }
  return socket;
};
