import type { NextPage } from 'next';
import Head from 'next/head';
import { createElement, DetailedHTMLProps, FC, Fragment, HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import rehypeSanitize from 'rehype-sanitize';

const p: FC<DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>> = (props) => {
  return <p className="text-red-500" {...props} />;
};

const formatter = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeHighlight)
  .use(rehypeReact, { createElement, Fragment, components: { p } });

interface IData {
  text: string;
  mdast?: ReturnType<typeof formatter['parse']>;
  hast?: Awaited<ReturnType<typeof formatter['run']>>;
  content?: ReactNode;
}

const Home: NextPage = () => {
  const [data, setData] = useState<IData>({ text: '' });

  useEffect(() => {
    const mdast = formatter.parse(data.text);
    formatter.run(mdast).then((hast) => {
      const content = formatter.stringify(hast);
      setData((data) => ({ ...data, mdast, hast, content }));
      console.log(JSON.stringify(hast, null, 2));
    });
  }, [data.text]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Markdown Editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <textarea value={data.text} onChange={({ target: { value: text } }) => setData((data) => ({ ...data, text }))} />
        {data.content}
      </main>
    </>
  );
};

export default Home;
