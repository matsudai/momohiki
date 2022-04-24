import type { NextPage } from 'next';
import { ClipboardEventHandler, createElement, useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHightlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';

import 'highlight.js/styles/default.css';

const initialTextOnEditor = '# Hello World\n\nWelcome to my page 👀\n\n<script>console.log(`X`)</script>\n';

// type HTMLAnchorElementProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
// const Ax: FC<HTMLAnchorElementProps> = ({ href, ...args }) => {
//   const url = href == null || href.match(/^(.\/|\/)/) ? href : '#';
//   return <a href={url} {...args} />;
// };

const Home: NextPage = () => {
  const [textOnEditor, setTextOnEditor] = useState(initialTextOnEditor);
  const [Content, setContent] = useState(() => <div />);
  const [mdastAsJson, setMdAstAsJson] = useState<string>('');
  const [fileFromClipboard, setFileFromClipboard] = useState<string>();

  useEffect(() => {
    const mdast = unified().use(remarkParse).use(remarkGfm).parse(textOnEditor);
    setMdAstAsJson(JSON.stringify(mdast, null, 2));

    try {
      unified()
        .use(remarkRehype)
        .use(rehypeHightlight, { ignoreMissing: true, subset: false }) // 言語が見つからないエラーを無視、言語の推測を無効
        .run(mdast, (error, transformedNode) => {
          if (error != null || transformedNode == null) {
            console.log(error);
          } else {
            setContent(
              unified()
                .use(rehypeReact, { createElement /* , components: { a: Ax } */ })
                .stringify(transformedNode as any)
            );
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [textOnEditor]);

  const onPaste: ClipboardEventHandler<HTMLDivElement> = async ({ clipboardData: { files } }) => {
    if (files.length > 0) {
      const file = files[0];
      const title = crypto.randomUUID();
      if (file.type === 'image/png') {
        const buffer = await new Promise<string>((resolve, reject) => {
          const ifs = new FileReader();
          ifs.readAsDataURL(file);
          ifs.onload = () => {
            typeof ifs.result === 'string' ? resolve(ifs.result) : reject('Type Error');
          };
          ifs.onerror = reject;
        });
        setFileFromClipboard(buffer);
        setTextOnEditor((text) => `${text}![${title}](${buffer})`);
      }
    }
  };

  return (
    <div>
      <main>
        <div onPaste={onPaste}>
          <textarea
            style={{ width: '640px', height: '120px' }}
            value={textOnEditor}
            onChange={({ target: { value } }) => {
              setTextOnEditor(value);
            }}
          />
        </div>
        <textarea style={{ width: '320px', height: '120px' }} value={mdastAsJson} onChange={() => {}} />
        {Content}
        {fileFromClipboard == null ? null : (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="paste" src={fileFromClipboard} />
        )}
      </main>
    </div>
  );
};

export default Home;
