import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHightlight from 'rehype-highlight';
import { unified } from 'unified';
import { Root } from 'rehype-highlight/lib';

const isHeading = (node: Root['children'][0]): node is Extract<Root['children'][0], { type: 'element' }> =>
  node.type === 'element' && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName);

const overwriteProps = (node: Root['children'][0], key: string) => {
  if (isHeading(node)) {
    let nodeProps = node.properties;
    nodeProps = { ...nodeProps, 'data-x-key': key };
    if (node.position != null) {
      const pos = node.position.start;
      nodeProps = { ...nodeProps, 'data-x-md-pos': JSON.stringify({ r: pos.line, c: pos.column }) };
    }
    node.properties = nodeProps;
    node.children.forEach((child, i) => overwriteProps(child, `${key}-${i}`));
  }
};

const filterTokens = (n: Root['children'][0], tokens: string[] = []): string[] => {
  if (n.type === 'text') {
    return [...tokens, n.value];
  } else if (n.type === 'element') {
    return n.children.reduce((sum, child) => filterTokens(child, sum), tokens);
  }
  return tokens;
};

export const md2Hast = async (md: string) => {
  const mdast = unified().use(remarkParse).use(remarkGfm).parse(md);
  const hast = await unified()
    .use(remarkRehype)
    .use(rehypeHightlight, { ignoreMissing: true, subset: false }) // 言語が見つからないエラーを無視、言語の推測を無効
    .use(() => (tree) => {
      tree.children.forEach((node, i) => {
        overwriteProps(node, i.toString());
      });
    })
    .run(mdast);

  let index: { key: string; text: string }[] = [];
  hast.children.forEach((node) => {
    if (isHeading(node)) {
      const key = node.properties?.['data-x-key'];
      if (typeof key === 'string') {
        index.push({ key, text: filterTokens(node).join('') });
      }
    }
  });

  return { hast, index };
};
