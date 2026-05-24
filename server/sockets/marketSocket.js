// sockets/marketSocket.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`📡 Client connected: ${socket.id}`);

    socket.on('subscribe', (symbols) => {
      symbols?.forEach(s => socket.join(`stock:${s}`));
    });

    socket.on('unsubscribe', (symbols) => {
      symbols?.forEach(s => socket.leave(`stock:${s}`));
    });

    socket.on('disconnect', () => {
      console.log(`📡 Client disconnected: ${socket.id}`);
    });
  });
};
