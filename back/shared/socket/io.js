// ─────────────────────────────────────────────────────────────
// SOCKET.IO SETUP
// ─────────────────────────────────────────────────────────────
import { Server } from 'socket.io';

let io = null;

const onlineUsers = new Map(); // username -> Set of socket ids

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:3001',
        'http://localhost:3002',
        'https://note-vevp.onrender.com',
        'http://localhost:3000',
      ],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('join', (username) => {
      if (!username) return;
      socket.join(username);
      socket.data.username = username;

      if (!onlineUsers.has(username)) onlineUsers.set(username, new Set());
      onlineUsers.get(username).add(socket.id);

      broadcastOnlineUsers();
    });

    socket.on('join-admin', () => {
      socket.join('admins');
      socket.data.isAdmin = true;
      socket.emit('online-users', Array.from(onlineUsers.keys()));
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected:', socket.id);
      const username = socket.data.username;
      if (username && onlineUsers.has(username)) {
        onlineUsers.get(username).delete(socket.id);
        if (onlineUsers.get(username).size === 0) {
          onlineUsers.delete(username);
        }
        broadcastOnlineUsers();
      }
    });
  });

  return io;
}

function broadcastOnlineUsers() {
  if (!io) return;
  io.to('admins').emit('online-users', Array.from(onlineUsers.keys()));
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io was not initialized yet — call initSocket() first in index.js');
  }
  return io;
}
