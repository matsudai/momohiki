import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHightlight from 'rehype-highlight';
import { unified } from 'unified';

export const md2Hast = async (md: string) => {
  const mdast = unified().use(remarkParse).use(remarkGfm).parse(md);

  return await unified()
    .use(remarkRehype)
    .use(rehypeHightlight, { ignoreMissing: true, subset: false }) // 言語が見つからないエラーを無視、言語の推測を無効
    .run(mdast);
};
