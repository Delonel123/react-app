const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
cors: {
origin: "http://localhost:3000",
methods: ["GET", "POST"],
},
});

const rooms = {}; // Хранилище данных комнат

app.use(cors());

io.on('connection', (socket) => {
console.log('A user connected');

// Создание комнаты
socket.on('createRoom', () => {
const roomId = uuidv4(); // Генерация уникального ID комнаты
rooms[roomId] = []; // Инициализация комнаты
socket.emit('roomCreated', { roomId, roomLink: `http://localhost:3000/${roomId}` });
});

// Подключение к комнате
socket.on('joinRoom', ({ roomId, username }) => {
if (rooms[roomId]) {
rooms[roomId].push({ username, id: socket.id });
socket.join(roomId);
io.to(roomId).emit('userJoined', { username, roomId });
console.log(`${username} joined room: ${roomId}`);
} else {
socket.emit('error', 'Room not found');
}
});

// Обработка изменений кода
socket.on('codeChange', ({ roomId, code }) => {
if (rooms[roomId]) {
console.log('CodeChange');
socket.broadcast.to(roomId).emit('codeChange', { code }); // Рассылаем изменения всем участникам комнаты
}
});

// Обработка перемещения курсора
socket.on('cursorMove', ({ roomId, cursorPosition, username }) => {
if (rooms[roomId]) {
socket.broadcast.to(roomId).emit('cursorMoved', { username, cursorPosition });
}
});

// Отключение пользователя
socket.on('disconnect', () => {
console.log('User disconnected');
// Здесь можно добавить логику для удаления пользователя из комнаты
});
});

server.listen(3001, () => {
console.log('Server running on port 3001');
});