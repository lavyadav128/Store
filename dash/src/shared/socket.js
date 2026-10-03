// src/socket.js
import { io } from 'socket.io-client';
import server from './environment';

const socket = io(server, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000,
  timeout: 15000,
});

export function connectSocket({ isAdmin = false } = {}) {
  if (!socket.connected) socket.connect();

  const emitJoin = () => {
    if (isAdmin) {
      socket.emit('join-admin');
    } else {
      const username = localStorage.getItem('username');
      if (username) socket.emit('join', username);
    }
  };

  if (socket.connected) {
    emitJoin();
  } else {
    socket.once('connect', emitJoin);
  }
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}

export default socket;