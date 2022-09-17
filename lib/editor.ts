import { ReactNode, useState } from 'react';
import { HastRoot, MdastRoot } from 'remark-rehype/lib';
import create from 'zustand';
import shallow from 'zustand/shallow';
import { markdown } from './document-transformer';

export const transform = async (text: string) => {
  const mdast = markdown.parse(text);
  const hast = await markdown.run(mdast);
  const component = markdown.stringify(hast);
  return { text, mdast, hast, component };
};

export interface IEditorContent {
  text: string;
  mdast: MdastRoot;
  hast: HastRoot;
  component: ReactNode;
}

export interface IEditor {
  content?: IEditorContent;
  setText: (text: string | undefined) => Promise<void>;
}

export const useEditor = create<IEditor>()((set) => ({
  setText: async (text) => {
    const content = text == null ? undefined : await transform(text);
    set(() => ({ content }));
  }
}));

export const useEditorText = (): [string | undefined, (value: string | undefined) => Promise<void>] =>
  useEditor(({ content, setText }) => [content?.text, setText], shallow);

export const useEditorComponent = () => useEditor(({ content }) => content?.component, shallow);
