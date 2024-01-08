import io from "socket.io-client";
import {config} from "@/config";

const url = config.serverUrl

let socket: any;

export const getSocket = () => {
    if (!socket) {
        socket = io(url);
    }
    return socket;
};
