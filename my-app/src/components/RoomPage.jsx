import React, { useState, useEffect, useRef } from "react";
import CodeEditor from "./CodeEditor";
import { useParams } from "react-router-dom";

const RoomPage = () => {
  const { roomId } = useParams(); // Получение ID комнаты из URL
  const [code, setCode] = useState("// Начни писать код здесь...");
  const ws = useRef(null); // WebSocket-соединение

  // Устанавливаем WebSocket соединение
  useEffect(() => {

    ws.current = new WebSocket("ws://https://urban-waffle-5x5q9rrgxwwc746w-4000.app.github.dev");

    // Подключение к комнате
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "JOIN_ROOM", roomId }));
    };

    // Обработка входящих сообщений
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "CODE_CHANGE") {
        setCode(data.code);
      }
    };

    // Закрытие соединения при размонтировании компонента
    return () => {
      ws.current.close();
    };
  }, [roomId]);

  // Отправка изменений кода
  const handleCodeChange = (newCode) => {
    setCode(newCode);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "CODE_CHANGE", roomId, code: newCode }));
    }
  };

  return (
    <div>
      <h2>Комната: {roomId}</h2>
      <input
        type="text"
        value={`${window.location.origin}/room/${roomId}`}
        readOnly
        style={{ width: "80%", marginBottom: "10px" }}
      />
      <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`)}>
        Скопировать ссылку
      </button>
      <CodeEditor code={code} language="javascript" onCodeChange={handleCodeChange} />
    </div>
  );
};

export default RoomPage;