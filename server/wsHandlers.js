const rooms = {}; // Хранилище для комнат

function handleWebSocketConnection(ws, wss, req) {
  let currentRoom = null;

  // Получение сообщений от клиента
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "JOIN_ROOM":
        currentRoom = data.roomId;
        if (!rooms[currentRoom]) {
          rooms[currentRoom] = [];
        }
        rooms[currentRoom].push(ws);
        console.log(`User joined room: ${currentRoom}`);
        break;

      case "CODE_CHANGE":
        if (currentRoom) {
          broadcastToRoom(currentRoom, data);
        }
        break;

      case "CURSOR_MOVE":
        if (currentRoom) {
          broadcastToRoom(currentRoom, data, ws); // Пересылка данных о курсоре
        }
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  });

  // Обработка закрытия соединения
  ws.on("close", () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom] = rooms[currentRoom].filter((client) => client !== ws);
      if (rooms[currentRoom].length === 0) {
        delete rooms[currentRoom];
      }
    }
    console.log("User disconnected");
  });
}

// Функция для пересылки сообщений всем клиентам в комнате
function broadcastToRoom(roomId, data, excludeWs = null) {
  if (rooms[roomId]) {
    rooms[roomId].forEach((client) => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = { handleWebSocketConnection };