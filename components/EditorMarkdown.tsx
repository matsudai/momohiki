import { ClipboardEventHandler, DragEventHandler, FC, SyntheticEvent, useEffect, useRef } from 'react';
import { useEditorCursor, useEditorText } from '../lib/editor';
import { Editor, IEditor } from './Editor';

export const EditorMd: FC = () => {
  const [text, setText] = useEditorText();
  const [cursor, setCursor] = useEditorCursor();
  const ref = useRef<IEditor | null>(null);

  const insertText = (text: string) => {
    const editor = ref.current;
    if (editor != null) {
      /**
       * [TODO] Paste event customization.
       *
       * refs: https://github.com/microsoft/monaco-editor/issues/3026
       *
       * When pasting, (1) paste clipboard data AS TEXT (2) call this function.
       * As a result, "image.png![](data:image/png;base64...)" is pasted.
       * But the file name "image.png" is unnecessary information.
       *
       * As an interim measure, roll back (1).
       */
      editor.trigger(null, 'undo', null);

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
      insertText(`![](${dataUrl})\n`);
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

  useEffect(() => {
    const editor = ref.current;
    if (cursor != null && editor != null) {
      const pos = editor.getPosition();
      if (pos != null) {
        if (pos.lineNumber !== cursor.line || pos.column !== cursor.column) {
          editor.setPosition({ lineNumber: cursor.line, column: cursor.column });
          editor.revealPositionNearTop({ lineNumber: cursor.line, column: cursor.column });
        }
      }
    }
  }, [ref, cursor]);

  return (
    <div onPaste={onPaste} onDrop={onDrop} onDragOver={preventDefault} className="w-full h-full">
      <Editor
        defaultLanguage="markdown"
        defaultValue=""
        value={text}
        onChange={setText}
        onMount={(editor) => {
          ref.current = editor;
          editor.onDidChangeCursorPosition(({ position }) => {
            const { lineNumber: line, column: column } = position;
            setCursor({ line, column });
          });
        }}
      />
    </div>
  );
};
