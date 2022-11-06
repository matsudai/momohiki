import { createElement, Fragment } from 'react';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { HastRoot } from 'remark-rehype/lib';
import { Plugin, unified } from 'unified';
import { visit } from 'unist-util-visit';
import * as components from './components';

export type HastChild = HastRoot['children'][number];
export type HastNode = HastRoot | HastChild;
export type HastElement = Extract<HastNode, { type: 'element' }>;

export interface ITopic {
  htmlId: string;
  level: number;
  headingText: string;
  position?: {
    start: {
      line: number;
      column: number;
    };
  };
}

export const rehypeWithHeadingId: Plugin<[], HastRoot> = () => {
  return (tree, _file) => {
    visit(tree, (node) => {
      if (node.type === 'element' && node.tagName.match(/^h[1-6]$/)) {
        const { tagName } = node;
        const { line, column, offset } = node.position?.start ?? {};
        const id =
          line == null || column == null || offset == null
            ? node.properties?.id != null
              ? node.properties.id
              : crypto.randomUUID()
            : `${tagName}-${line}-${column}-${offset}`;

        node.properties = { ...node.properties, id };
      }
    });
  };
};

export const markdown = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeWithHeadingId)
  .use(rehypeReact, { createElement, Fragment, components });

export const filterTopics = (root: HastRoot): ITopic[] => {
  let topics: ITopic[] = [];
  visit(root, (node) => {
    if (node.type === 'element') {
      if (node.tagName.match(/^h[1-6]$/) && typeof node.properties?.id === 'string') {
        const { position } = node;
        const htmlId = node.properties.id;
        const level = Number(node.tagName[1]);

        let tokens: string[] = [];
        visit(node, (child) => {
          if (child.type === 'text') {
            tokens.push(child.value);
          }
        });
        const headingText = tokens.join(' ');

        topics.push({ htmlId, level, headingText, position });
      }
    }
  });
  return topics;
};
