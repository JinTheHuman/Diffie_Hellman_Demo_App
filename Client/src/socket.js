import React from "react";
import io from "socket.io-client";

export const socket = io(`https://diffie-demo.herokuapp.com/`);
const SocketContext = React.createContext(socket);