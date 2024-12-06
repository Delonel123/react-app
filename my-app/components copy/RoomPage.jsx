import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import { useParams } from "react-router-dom";

const RoomPage = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState("// Начни писать код здесь...");

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Здесь будет синхронизация через WebSocket
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