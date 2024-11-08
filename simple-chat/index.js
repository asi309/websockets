const express = require('express');
const http = require('node:http');
const path = require('node:path');
const { Server } = require('socket.io');

const PORT = 9000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.io
io.on('connection', (socket) => {
  console.log('A new user has connected', socket.id);
  socket.on('message', (message) => {
    console.log('A new Message has arrived!', message);
    io.emit('message', message);
  });
});

app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
  return res.sendFile('/public/index.html');
});

server.listen(PORT, () => console.log(`Server started at ${PORT}`));
