import { ReactNode } from 'react';
import { HastRoot, MdastRoot } from 'remark-rehype/lib';
import create from 'zustand';
import shallow from 'zustand/shallow';
import { markdown } from './document-transformer';

export interface ITopic {
  htmlId: string;
  level: number;
  name: string;
  position?: {
    start: {
      line: number;
      column: number;
    };
  };
}

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

type HastChild = HastRoot['children'][number];
type HastElement = Extract<HastChild, { type: 'element' }>;
type HastNode = HastRoot | HastChild;

export const reduceTopicTexts = (node: HastNode, tokens: string[] = []): string[] => {
  switch (node.type) {
    case 'root':
    case 'element':
      return [...tokens, ...node.children.flatMap((n) => reduceTopicTexts(n))];
    case 'text':
      return [...tokens, node.value];
    default:
      return tokens;
  }
};

export const parseTopics = (node: HastNode, topics: ITopic[] = []): ITopic[] => {
  switch (node.type) {
    case 'root':
      return [...topics, ...node.children.flatMap((n) => parseTopics(n))];
    case 'element':
      if (
        node.tagName === 'h1' ||
        node.tagName === 'h2' ||
        node.tagName === 'h3' ||
        node.tagName === 'h4' ||
        node.tagName === 'h5' ||
        node.tagName === 'h6'
      ) {
        const htmlId = node.properties?.id?.toString() ?? '';
        const level = Number(node.tagName[1]);
        const name = reduceTopicTexts(node).join(' ');
        return [...topics, { htmlId, level, name, position: node.position }];
      } else {
        return [...topics, ...node.children.flatMap((n) => parseTopics(n))];
      }
    default:
      return topics;
  }
};

const hastWithIdImpl = <T extends HastChild | HastElement>(node: T): T => {
  switch (node.type) {
    case 'element':
      if (
        node.tagName === 'h1' ||
        node.tagName === 'h2' ||
        node.tagName === 'h3' ||
        node.tagName === 'h4' ||
        node.tagName === 'h5' ||
        node.tagName === 'h6'
      ) {
        const { line, column, offset } = node.position?.start ?? {};
        const htmlId =
          line == null || column == null || offset == null ? crypto.randomUUID() : `${node.tagName}-${line}-${column}-${offset}`;
        return { ...node, properties: { ...node.properties, id: htmlId }, children: node.children.map(hastWithIdImpl) };
      } else {
        return { ...node, children: node.children.map(hastWithIdImpl) };
      }
    default:
      return node;
  }
};

const hastWithId = (hast: HastRoot): HastRoot => ({ ...hast, children: hast.children.map(hastWithIdImpl) });

export const transform = async (text: string, content: IEditorContent | undefined) => {
  try {
    const mdast = markdown.parse(text);
    try {
      const hast = hastWithId(await markdown.run(mdast));
      const topics = parseTopics(hast);
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
