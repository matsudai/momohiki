import { ReactNode, useState } from 'react';
import { HastRoot, MdastRoot } from 'remark-rehype/lib';
import create from 'zustand';
import shallow from 'zustand/shallow';
import { markdown } from './document-transformer';

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

export const transform = async (text: string, content: IEditorContent | undefined) => {
  try {
    const mdast = markdown.parse(text);
    try {
      const hast = await markdown.run(mdast);
      try {
        const component = markdown.stringify(hast);
        return { text, mdast, hast, component };
      } catch {
        return content == null ? content : { ...content, text, mdast, hast };
      }
    } catch {
      return content == null ? content : { ...content, text, mdast };
    }
  } catch {
    return content;
  }
};

export const useEditor = create<IEditor>()((set, get) => ({
  setText: async (text) => {
    const content = text == null ? undefined : await transform(text, get().content);
    set(() => ({ content }));
  }
}));

export const useEditorText = (): [string | undefined, (value: string | undefined) => Promise<void>] =>
  useEditor(({ content, setText }) => [content?.text, setText], shallow);

export const useEditorMdast = () => useEditor(({ content }) => content?.mdast, shallow);
export const useEditorHast = () => useEditor(({ content }) => content?.hast, shallow);
export const useEditorComponent = () => useEditor(({ content }) => content?.component, shallow);
