import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { FC, useCallback, useRef } from 'react';
import { useEditorContext } from './EditorContext';

type EditorInstance = Parameters<OnMount>[0];

export const Editor: FC = () => {
  const { data, setData } = useEditorContext();
  const ref = useRef<EditorInstance>(null);
  const setText = useCallback((text: string | undefined) => setData((data) => ({ ...data, text: text ?? '' })), [setData]);

  return (
    <MonacoEditor
      defaultLanguage="markdown"
      defaultValue=""
      value={data.text}
      onChange={(value) => {
        setText(value ?? '');
      }}
      width="45vw"
      height="45vh"
      onMount={(editor) => {
        ref.current = editor;
      }}
    />
  );
};
