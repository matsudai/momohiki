import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { FC, useRef, useState } from 'react';

type EditorInstance = Parameters<OnMount>[0];

export const Editor: FC = () => {
  const [text, setText] = useState<string>('');
  const ref = useRef<EditorInstance>(null);

  return (
    <MonacoEditor
      defaultLanguage="markdown"
      defaultValue=""
      value={text}
      onChange={(value) => {
        setText(value ?? '');
      }}
      width="45vw"
      height="80vh"
      onMount={(editor) => {
        ref.current = editor;
      }}
    />
  );
};
