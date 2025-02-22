import { FC, useMemo, useRef } from 'react';
import { useEditorMdast } from '../lib/editor';
import { Editor, IEditor } from './Editor';

export const PreviewMdast: FC = () => {
  const hast = useEditorMdast();
  const value = useMemo(() => JSON.stringify(hast, null, 2), [hast]);
  const ref = useRef<IEditor | null>(null);

  return (
    <div className="w-full h-full">
      <Editor
        defaultLanguage="json"
        defaultValue=""
        value={value}
        onMount={(editor) => {
          ref.current = editor;
        }}
        options={{ readOnly: true, tabSize: 2 }}
      />
    </div>
  );
};
