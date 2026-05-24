import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) return socket;
  socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });
  socket.on('connect',    () => console.log('🔌 Socket connected:', socket.id));
  socket.on('disconnect', () => console.log('🔌 Socket disconnected'));
  socket.on('connect_error', (e) => console.warn('Socket error:', e.message));
  return socket;
};

export const getSocket = () => socket;

export const subscribeToStocks = (symbols) => {
  if (socket?.connected) socket.emit('subscribe', symbols);
};

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};
