"use client";
import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
console.log("API",API_URL)

export let socket = io(`${API_URL}`, {
  transports: ["websocket"],
  reconnection: (true),
  reconnectionDelay: 500,
  reconnectionAttempts: Infinity,
});

socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") {
    socket.connect();
  }
});


socket.on("error", (error) => {
  console.error("Socket Error:", error);
});
//Trigger Event
export async function triggerEvent(event) {
  if (!socket.connected) {
    connectSocket();
  }
  socket.emit(event.event_name, event.data);
}
//Listen Event
export async function listenEvent(event) {
  if (socket) {
   socket.off(event.event_name);
    socket.on(event.event_name, event.handler);
  }
 
}
// Connect Socket
export function connectSocket() {
  socket.connect();
}

// Optional cleanup (if needed)
export async function disconnectSocket(){
  socket.disconnect();
}
