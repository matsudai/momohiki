import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { ClipboardEventHandler, DragEventHandler, FC, SyntheticEvent, useCallback, useRef } from 'react';
import { saveFile } from '../lib/persist';
import { useEditorState, useEditorTextState } from '../lib/storage';

type EditorInstance = Parameters<OnMount>[0];

export const Editor: FC = () => {
  const [data] = useEditorState();
  const [_, setText] = useEditorTextState();
  const ref = useRef<EditorInstance>(null);

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
    const title = crypto.randomUUID();
    if (file.type === 'image/png') {
      // const buffer = await new Promise<string>((resolve, reject) => {
      //   const ifs = new FileReader();
      //   ifs.readAsDataURL(file);
      //   ifs.onload = () => {
      //     typeof ifs.result === 'string' ? resolve(ifs.result) : reject('Type Error');
      //   };
      //   ifs.onerror = reject;
      // });
      const { type, name } = file;
      const data = await file.arrayBuffer();
      const hash = await saveFile({ name, type, data });

      // insertText(`![${title}](${buffer})`);
      insertText(`![${title}](./mocks/sample.png?${hash})`);
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
