import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { ClipboardEventHandler, DragEventHandler, FC, SyntheticEvent, useCallback, useRef } from 'react';
import { useEditorContext } from './EditorContext';

type EditorInstance = Parameters<OnMount>[0];

export const Editor: FC = () => {
  const { data, setData } = useEditorContext();
  const ref = useRef<EditorInstance>(null);
  const setText = useCallback((text: string | undefined) => setData((data) => ({ ...data, text: text ?? '' })), [setData]);

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
      const buffer = await new Promise<string>((resolve, reject) => {
        const ifs = new FileReader();
        ifs.readAsDataURL(file);
        ifs.onload = () => {
          typeof ifs.result === 'string' ? resolve(ifs.result) : reject('Type Error');
        };
        ifs.onerror = reject;
      });

      insertText(`![${title}](${buffer})`);
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
        onChange={(value) => {
          setText(value ?? '');
        }}
        onMount={(editor) => {
          ref.current = editor;
        }}
      />
    </div>
  );
};
