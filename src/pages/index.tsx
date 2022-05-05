import type { NextPage } from 'next';
import { ClipboardEventHandler, createElement, DragEventHandler, SyntheticEvent, useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHightlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import Editor from '@monaco-editor/react';

import 'highlight.js/styles/default.css';

const initialTextOnEditor = '# Hello World\n\nWelcome to my page 👀\n';

const Home: NextPage = () => {
  const [textOnEditor, setTextOnEditor] = useState(initialTextOnEditor);
  const [Content, setContent] = useState(() => <div />);
  const [hast, setHast] = useState<string>('');
  const [mdastAsJson, setMdAstAsJson] = useState<string>('');

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
            setHast(
              unified()
                .use(rehypeStringify)
                .stringify(transformedNode as any) as any
            );
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [textOnEditor]);

  const insertFileIntoTextOnEditor = async (file: File) => {
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
      setTextOnEditor((text) => `${text}![${title}](${buffer})`);
    }
  };

  const onPaste: ClipboardEventHandler<HTMLDivElement> = async ({ clipboardData: { files } }) => {
    if (files.length > 0) {
      insertFileIntoTextOnEditor(files[0]);
    }
  };

  const onDrop: DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      insertFileIntoTextOnEditor(files[0]);
    }
  };

  const preventDefault = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div>
      <main>
        <div style={{ display: 'flex' }}>
          <div>
            <p style={{ backgroundColor: '#eeeeee' }}>Markdown</p>
            <div onPaste={onPaste} onDrop={onDrop} onDragOver={preventDefault}>
              <Editor
                defaultLanguage="markdown"
                defaultValue=""
                value={textOnEditor}
                onChange={(value) => {
                  setTextOnEditor(value ?? '');
                }}
                width="640px"
                height="360px"
              />
            </div>
          </div>

          <div>
            <p style={{ backgroundColor: '#eeeeee' }}>Rendered HTML</p>
            <div>{Content}</div>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <div>
            <p style={{ backgroundColor: '#eeeeee' }}>Markdown AST</p>
            <Editor
              defaultLanguage="json"
              defaultValue=""
              value={mdastAsJson}
              onChange={(value) => {
                setTextOnEditor(value ?? '');
              }}
              width="640px"
              height="360px"
            />
          </div>

          <div>
            <p style={{ backgroundColor: '#eeeeee' }}>HTML AST</p>
            <code>
              <pre>{hast}</pre>
            </code>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
