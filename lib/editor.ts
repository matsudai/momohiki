import { ReactNode } from 'react';
import { HastRoot, MdastRoot } from 'remark-rehype/lib';
import create from 'zustand';
import shallow from 'zustand/shallow';
import { markdown, filterTopics, ITopic } from './translation';

export interface IEditorContent {
  text: string;
  mdast: MdastRoot;
  hast: HastRoot;
  component: ReactNode;
  topics: ITopic[];
}

export interface ICursor {
  line: number;
  column: number;
}

export interface IEditor {
  content?: IEditorContent;
  cursor?: ICursor;
  setText: (text: string | undefined) => Promise<void>;
  setCursor: (cursor: ICursor | undefined) => void;
}

export const transform = async (text: string, content: IEditorContent | undefined) => {
  try {
    const mdast = markdown.parse(text);
    try {
      const hast = await markdown.run(mdast);
      const topics = filterTopics(hast);
      try {
        const component = markdown.stringify(hast);
        return { text, mdast, hast, component, topics };
      } catch {
        return content == null ? content : { ...content, text, mdast, hast, topics };
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
  },
  setCursor: (cursor) => {
    set(() => ({ cursor }));
  }
}));

export const useEditorText = (): [string | undefined, (value: string | undefined) => Promise<void>] =>
  useEditor(({ content, setText }) => [content?.text, setText], shallow);

export const useEditorCursor = (): [ICursor | undefined, (value: ICursor | undefined) => void] =>
  useEditor(({ cursor, setCursor }) => [cursor, setCursor], shallow);

export const useEditorMdast = () => useEditor(({ content }) => content?.mdast, shallow);
export const useEditorHast = () => useEditor(({ content }) => content?.hast, shallow);
export const useEditorComponent = () => useEditor(({ content }) => content?.component, shallow);
export const useEditorTopicTree = () => useEditor(({ content }) => content?.topics, shallow);
