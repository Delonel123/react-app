import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const HomePage = () => {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = uuidv4(); // Генерация уникального ID комнаты
    navigate(`/room/${roomId}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Создай комнату для совместного программирования</h1>
      <button onClick={createRoom}>Создать комнату</button>
    </div>
  );
};

export default HomePage;