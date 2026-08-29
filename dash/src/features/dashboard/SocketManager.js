// src/components/SocketManager.js
import { useEffect } from 'react';
import socket, { connectSocket } from '../../shared/socket';

const ADMIN_EMAIL = 'adminbrand@gmail.com';

const SocketManager = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const email = (localStorage.getItem('email') || '').trim().toLowerCase();
    const username = (localStorage.getItem('username') || '').trim().toLowerCase();
    const role = (localStorage.getItem('role') || '').trim().toLowerCase();
    const isAdmin =
      role === 'admin' ||
      email === ADMIN_EMAIL ||
      username === ADMIN_EMAIL ||
      email.includes('adminbrand') ||
      username.includes('adminbrand') ||
      window.location.pathname.includes('admin');

    connectSocket({ isAdmin });

    const handleDoubtReply = (notification) => {
      window.dispatchEvent(new CustomEvent('doubt-reply', { detail: notification }));
    };

    const handleNewDoubt = (doubt) => {
      window.dispatchEvent(new CustomEvent('new-doubt', { detail: doubt }));
    };

    const handleOnlineUsers = (usernames) => {
      window.dispatchEvent(new CustomEvent('online-users', { detail: usernames }));
    };

    socket.on('doubt-reply', handleDoubtReply);
    socket.on('new-doubt', handleNewDoubt);
    socket.on('online-users', handleOnlineUsers);

    return () => {
      socket.off('doubt-reply', handleDoubtReply);
      socket.off('new-doubt', handleNewDoubt);
      socket.off('online-users', handleOnlineUsers);
    };
  }, []);

  return null;
};

export default SocketManager;