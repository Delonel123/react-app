import { useState } from 'react';

const useEditorStore = () => {
const [editorData, setEditorData] = useState({ editor: null, monaco: null });

const setEditor = (editor, monaco) => {
setEditorData({ editor, monaco });
};

return {
editorData,
setEditor,
};
};

export default useEditorStore;