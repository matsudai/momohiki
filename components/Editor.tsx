import MonacoEditor, { loader, OnMount } from '@monaco-editor/react';
import { ClipboardEventHandler, DragEventHandler, FC, SyntheticEvent, useEffect, useRef } from 'react';
import { useEditorState, useEditorTextState } from '../lib/storage';

loader.config({ paths: { vs: '/monaco-editor/min/vs' } });

type EditorInstance = Parameters<OnMount>[0];

export const Editor: FC = () => {
  const [data] = useEditorState();
  const [_, setText] = useEditorTextState();
  const ref = useRef<EditorInstance | null>(null);

  // useEffect(() => {
  //   loader.init().then(console.log);
  // }, []);

  const insertText = (text: string) => {
    const editor = ref.current;
    if (editor != null) {
      const selections = editor.getSelections();
      if (selections != null) {
        editor.executeEdits(
          null,
          selections.map((selection: any) => ({
            range: selection,
            text: text,
            forceMoveMarkers: true
          }))
        );
      } else {
        console.error('Cursor not found');
      }
    } else {
      console.error('Editor not found');
    }
  };

  const insertFile = async (file: File) => {
    if (file.type === 'image/png') {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const ifs = new FileReader();
        ifs.readAsDataURL(file);
        ifs.onload = () => {
          typeof ifs.result === 'string' ? resolve(ifs.result) : reject('Type Error');
        };
        ifs.onerror = reject;
      });
      insertText(`![](${dataUrl})`);
    }
  };

  const onPaste: ClipboardEventHandler<HTMLDivElement> = async ({ clipboardData: { files } }) => {
    if (files.length > 0) {
      insertFile(files[0]);
    }
  };

  const onDrop: DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      insertFile(files[0]);
    }
  };

  const preventDefault = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div onPaste={onPaste} onDrop={onDrop} onDragOver={preventDefault} className="w-full h-full">
      <MonacoEditor
        defaultLanguage="markdown"
        defaultValue=""
        value={data.text}
        onChange={setText}
        onMount={(editor) => {
          ref.current = editor;
        }}
      />
    </div>
  );
};
