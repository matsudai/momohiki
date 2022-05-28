import * as Markdoc from '@markdoc/markdoc';
import hljs from 'highlight.js';

const instantiateTransformer = (name: string) => (node: Markdoc.Node, config: Markdoc.Config) => {
  const attributes = node.transformAttributes(config);
  const children = node.transformChildren(config);
  return new Markdoc.Tag(name, attributes, children);
};

const nodes: Partial<typeof Markdoc.nodes> = {
  /*
   * Toplevel Article.
   */
  document: {
    ...Markdoc.nodes.document,
    transform: instantiateTransformer('X-article')
  },
  /*
   * Heading. (4 - 6 are same level.)
   */
  heading: {
    ...Markdoc.nodes.heading,
    transform: (node, config) => {
      const attributes = node.transformAttributes(config);
      const children = node.transformChildren(config);
      const level = node.attributes.level;
      const name =
        level === 1
          ? 'X-h1'
          : level === 2
          ? 'X-h2'
          : level === 3
          ? 'X-h3'
          : level === 4
          ? 'X-h4'
          : level === 5
          ? 'X-h5'
          : level === 6
          ? 'X-h6'
          : 'X-h1';
      return new Markdoc.Tag(name, attributes, children);
    }
  },
  /*
   * Link.
   */
  link: {
    ...Markdoc.nodes.link,
    transform: instantiateTransformer('X-a')
  },
  /*
   * Table.
   */
  table: {
    ...Markdoc.nodes.table,
    transform: instantiateTransformer('X-table')
  },
  thead: {
    ...Markdoc.nodes.thead,
    transform: instantiateTransformer('X-thead')
  },
  tbody: {
    ...Markdoc.nodes.tbody,
    transform: instantiateTransformer('X-tbody')
  },
  tr: {
    ...Markdoc.nodes.tr,
    transform: instantiateTransformer('X-tr')
  },
  th: {
    ...Markdoc.nodes.th,
    transform: instantiateTransformer('X-th')
  },
  td: {
    ...Markdoc.nodes.td,
    transform: instantiateTransformer('X-td')
  },
  /*
   * Paragraph.
   */
  paragraph: {
    ...Markdoc.nodes.paragraph,
    transform: instantiateTransformer('X-p')
  },
  em: {
    ...Markdoc.nodes.em,
    transform: instantiateTransformer('X-em')
  },
  s: {
    ...Markdoc.nodes.s,
    transform: instantiateTransformer('X-s')
  },
  strong: {
    ...Markdoc.nodes.strong,
    transform: instantiateTransformer('X-strong')
  },
  blockquote: {
    ...Markdoc.nodes.blockquote,
    transform: instantiateTransformer('X-blockquote')
  },
  /*
   * Lists.
   */
  list: {
    ...Markdoc.nodes.list,
    transform: (node, config) => {
      const attributes = node.transformAttributes(config);
      const children = node.transformChildren(config);
      const ordered = node.attributes.ordered;
      const name = ordered ? 'X-ol' : 'X-ul';
      return new Markdoc.Tag(name, attributes, children);
    }
  },
  item: {
    ...Markdoc.nodes.item,
    transform: instantiateTransformer('X-li')
  },
  /*
   * Horizontal Separator.
   */
  hr: {
    ...Markdoc.nodes.hr,
    transform: instantiateTransformer('X-hr')
  },
  /*
   * Image
   */
  image: {
    ...Markdoc.nodes.image,
    transform: instantiateTransformer('X-img')
  },
  fence: {
    ...Markdoc.nodes.fence,
    transform: (node, config) => {
      const attributes = node.transformAttributes(config);
      const children = node.transformChildren(config);
      let content = node.attributes.content;
      const language = node.attributes.language ?? 'plaintext';
      if (hljs.getLanguage(language) != null) {
        try {
          content = `<code class="hljs language-${language}">${
            hljs.highlight(content, { language: language ?? 'txt' }).value
          }</code>`;
        } catch {
          content = `<code class="hljs language-plaintext">${content}</code>`;
        }
      } else {
        content = `<code class="hljs language-plaintext">${content}</code>`;
      }
      return new Markdoc.Tag('X-fence', { ...attributes, 'data-code': content }, children);
    }
  },
  code: {
    ...Markdoc.nodes.code,
    transform: (node, config) => {
      const attributes = node.transformAttributes(config);
      const children = node.transformChildren(config);
      return new Markdoc.Tag('X-code', attributes, [node.attributes.content, ...children]);
    }
  }
};

export const md2ast = (md: string) => {
  const ast = Markdoc.parse(md);
  return ast;
};

const mergeStringNodeRecursive = (node: Markdoc.RenderableTreeNode, value?: string): string | undefined => {
  if (node == null) {
    return value;
  } else if (typeof node === 'string') {
    return `${value ?? ''}${node}`;
  } else {
    return node.children.reduce((sum, child) => mergeStringNodeRecursive(child, sum), value);
  }
};

export const parseToc = (
  tree: Markdoc.RenderableTreeNode,
  toc?: { level: 1 | 2 | 3 | 4 | 5 | 6; title: string }[]
): { level: 1 | 2 | 3 | 4 | 5 | 6; title: string }[] => {
  toc = toc ?? [];

  if (tree == null || typeof tree == 'string') {
    return toc;
  }

  const level =
    tree.name === 'X-h1'
      ? 1
      : tree.name === 'X-h2'
      ? 2
      : tree.name === 'X-h3'
      ? 3
      : tree.name === 'X-h4'
      ? 4
      : tree.name === 'X-h5'
      ? 5
      : tree.name === 'X-h6'
      ? 6
      : null;

  if (level != null) {
    const title = mergeStringNodeRecursive(tree);
    return tree.children.reduce((sum, child) => parseToc(child, sum), title == null ? toc : [...toc, { level, title }]);
  } else {
    return tree.children.reduce((sum, child) => parseToc(child, sum), toc);
  }
};

export const ast2tree = (ast: Markdoc.Node, config?: Markdoc.Config) => {
  const tree = Markdoc.transform(ast, { nodes, ...config });
  return tree;
};
