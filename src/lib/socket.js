import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://chatapp-frontend-ytyc.onrender.com', // Your React frontend
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('new-user', (userId) => {
    console.log('User logged in via socket:', userId);
  });

  socket.on('join-room', ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join('_');
    socket.join(roomId);
    console.log(`User ${senderId} joined room ${roomId}`);
  });

  socket.on('send-message', (message) => {
    const roomId = [message.senderId, message.receiverId].sort().join('_');
    socket.to(roomId).emit('receive-message', message);
    console.log(`Message sent from ${message.senderId} to ${message.receiverId} in room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export { io, server, app };
