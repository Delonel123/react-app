import React from "react";
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, language, onCodeChange }) => {
  return (
    <div style={{ height: "80vh", border: "1px solid #ddd" }}>
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        onChange={onCodeChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false }, // Отключить миникарту
          automaticLayout: true,      // Автоматическая адаптация размера
        }}
      />
    </div>
  );
};

export default CodeEditor;