const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { handleWebSocketConnection } = require("./wsHandlers");

const app = express();
const PORT = 4000;

// Создаем HTTP-сервер и подключаем WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Обработка WebSocket соединений
wss.on("connection", (ws, req) => {
  console.log('connection');
  handleWebSocketConnection(ws, wss, req);
});

// Запускаем сервер
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});