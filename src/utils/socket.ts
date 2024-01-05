import io from "socket.io-client";

let socket;

// const socket = io('http://localhost:3001');

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3001");
  }
  return socket;
};
