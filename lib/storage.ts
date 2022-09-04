import { atom, useAtom } from 'jotai';
import { ReactNode } from 'react';
import { HastRoot, MdastRoot } from 'remark-rehype/lib';
import { formatter } from './markdown';

export interface IEditorState {
  text?: string;
  mdast?: MdastRoot;
  hast?: HastRoot;
  content?: ReactNode;
}

export const editorState = atom<IEditorState>({});
export const editorTextState = atom<IEditorState['text'], IEditorState['text']>(
  (get) => get(editorState).text,
  async (_, set, text) => {
    const mdast = formatter.parse(text);
    const hast = await formatter.run(mdast);
    const content = formatter.stringify(hast);
    set(editorState, { text, mdast, hast, content });
  }
);

export const useEditorState = () => useAtom(editorState);
export const useEditorTextState = () => useAtom(editorTextState);
