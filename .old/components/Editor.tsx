import MonacoEditor, { EditorProps, loader, OnMount } from '@monaco-editor/react';
import { ForwardedRef, forwardRef } from 'react';

loader.config({ paths: { vs: '/monaco-editor/min/vs' } });

export type IEditor = Parameters<OnMount>[0];

const EditorImpl = (props: EditorProps, ref: ForwardedRef<IEditor>) => {
  return <MonacoEditor {...props} />;
};

export const Editor = forwardRef(EditorImpl);
