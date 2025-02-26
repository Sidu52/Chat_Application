require('dotenv').config()
const express = require("express");
const app = express();
const socketIo = require("socket.io");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

const usersMap = {}; // Map to store users
io.on("connection", (socket) => {
  console.log("User Connected");
  
  socket.on("disconnect", () => {
    console.log("usersMap",usersMap)
    console.log("User Disconnected",socket.id);
    const getDisconnectUser = usersMap[socket.id];
    if(getDisconnectUser){
      socket.broadcast.emit("user_offline", false); // emit to all other connected users
        delete usersMap[socket.id];
    }
  });
  // Join Room
  socket.on("join_room", (data) => {
    const { name, roomId } = data;
    const users = io.sockets.adapter.rooms.get(roomId);
    if (users && [...users].length >= 2) {
        socket.emit('joinRoom', "Room is Full"); // Emit a message to the room that a user has joined
        return;
    }
    socket.join(roomId);
    usersMap[socket.id] = data.name; 
    if(users && [...users].length == 2) {
        const userArray = [...users]; // Convert Set to an array
        // Find the user whose name is not the same as the current user's name
        const otherUserSocketId = userArray.find(id => id !== socket.id);
        const otherUserName = usersMap[otherUserSocketId];
        // Emit the start chat event to both users
        socket.to(roomId).emit('start_chat', { name, roomId });
        socket.emit('start_chat', { name: otherUserName, roomId });  
    }else{
        socket.emit('joinRoom',"Waiting for other user to join"); // Emit a message to the room that a user has joined
    }
  });
  // Typing Status
  socket.on('typing', (data)=>{
    socket.to(data.roomId).emit('typing_status',data.status)
  })
  // Send Message
  socket.on("chat_message",(data)=>{
    const {roomId} = data;
    socket.to(roomId).emit("send_message",data);
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
