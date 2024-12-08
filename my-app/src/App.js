import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import socket from './socket';
import useEditorStore from './useEditorStore';
import './App.css';

function App() {
const { roomId } = useParams();
const navigate = useNavigate();
const { editorData, setEditor } = useEditorStore();
const [code, setCode] = useState('');
const [username, setUsername] = useState('');
const [isInRoom, setIsInRoom] = useState(false);
const [cursors, setCursors] = useState({});
const [roomLink, setRoomLink] = useState('');
const [previousDecorations, setPreviousDecorations] = useState(null);

useEffect(() => {
socket.on('cursorMoved', ({ username, cursorPosition }) => {
  console.log('Cursor modeeed')
setCursors((prev) => ({
...prev,
[username]: cursorPosition,
}));
});

socket.on('codeChange', ({ code }) => {
  console.log('Code was Change UI')
setCode(code);
});

socket.on('roomCreated', ({ roomId, roomLink }) => {
setRoomLink(roomLink);
navigate(`/${roomId}`);
});

return () => {
socket.off('cursorMoved');
socket.off('codeChange');
socket.off('roomCreated');
};
}, [navigate]);

const createRoom = () => {
socket.emit('createRoom');
};

const joinRoom = () => {
if (roomId && username) {
socket.emit('joinRoom', { roomId, username });
setIsInRoom(true);
}
};
const handleEditorChange = (value) => {
setCode(value);
if (roomId) {
console.log('CodeChange')
socket.emit('codeChange', { roomId, code: value });
}
};
const handleEditorDidMount = (editor, monaco) => {
setEditor(editor, monaco); // Сохраняем редактор и monaco в глобальный стор
};

// useEffect для обработки изменений курсоров
useEffect(() => {
if (editorData.editor && editorData.monaco) {

const editor = editorData.editor;
const monaco = editorData.monaco;

// Подсветка курсоров

const decorations = Object.keys(cursors)
.filter((user) => user !== username) // Исключаем свой курсор
.map((user) => {
const cursor = cursors[user];
return {
range: new monaco.Range(
cursor.lineNumber,
cursor.column,
cursor.lineNumber,
cursor.column
),
options: {
isWholeLine: false,
className: `cursor-${user}`,
},
};
});

// Удаляем старые декорации и добавляем новые
console.log('previousDecorations');
console.log(previousDecorations);
setPreviousDecorations(editor.deltaDecorations(previousDecorations || [], decorations))


// Отправка курсора при движении
editor.onDidChangeCursorPosition((event) => {
const position = event.position;
console.log('position')
console.log(position);
if (roomId) {
console.log('cursorMove')
socket.emit('cursorMove', { roomId, cursorPosition: position, username });
}
});
}
}, [cursors, editorData]);

return (
<div className="App">
{!roomId && !isInRoom ? (
<div>
<button onClick={createRoom}>Create Room</button>
{roomLink && <p>Room created! Share this link: <a href={roomLink}>{roomLink}</a></p>}
</div>
) : !isInRoom ? (
<div>
<input
type="text"
placeholder="Enter Your Name"
onChange={(e) => setUsername(e.target.value)}
/>
<button onClick={joinRoom}>Join Room</button>
</div>
) : (
<div>
<h2>Room ID: {roomId}</h2>
<MonacoEditor
height="500px"
language="javascript"
value={code}
onChange={handleEditorChange}
onMount={handleEditorDidMount} // Подключаем обработчик через onMount
/>
</div>
)}
</div>
);
}

export default App;