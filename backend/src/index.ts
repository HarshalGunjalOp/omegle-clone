import { Socket } from "socket.io";
import http from "http";

import express from 'express';
import { Server } from 'socket.io';
import { UserManager } from "./managers/UserManger";

const app = express();
const server = http.createServer(http);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const userManager = new UserManager();

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  userManager.addUser("randomName", socket);

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userManager.removeUser(socket.id);
  })
});

// Keep the listen call for local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}