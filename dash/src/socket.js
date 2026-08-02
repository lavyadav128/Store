// src/socket.js
import { io } from 'socket.io-client';
import server from './environment';

const socket = io(server, {
  autoConnect: false,
  withCredentials: true,
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