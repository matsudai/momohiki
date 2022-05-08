import type { GetStaticProps, NextPage } from 'next';
import {
  ClipboardEventHandler,
  createElement,
  DragEventHandler,
  SyntheticEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHightlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import Editor, { loader } from '@monaco-editor/react';
import { constants } from '../lib/constants';
import { readFile } from 'fs/promises';
import { Heading, HeadingProps } from '@chakra-ui/react';

loader.config({ paths: { vs: `${constants.basePath}/monaco-editor/min/vs` } });

type EditorInstance = Parameters<Extract<Parameters<typeof Editor>[0]['onMount'], Function>>[0];

interface PageProps {
  htmlCssText: string;
}

const initialTextOnEditor = '# Hello World\n\nWelcome to my page 👀\n';

const Page: NextPage<PageProps> = ({ htmlCssText }) => {
  const [textOnEditor, setTextOnEditor] = useState(initialTextOnEditor);
  const [Content, setContent] = useState(() => <div />);
  const [htmlBody, setHtmlBody] = useState<string>('');
  const [mdastAsJson, setMdAstAsJson] = useState<string>('');
  const editorRef = useRef<EditorInstance | null>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const mdast = unified().use(remarkParse).use(remarkGfm).parse(textOnEditor);
    setMdAstAsJson(JSON.stringify(mdast, null, 2));

    const components = {
      h1: (props: HeadingProps) => <Heading as="h1" {...props} />
    };

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
                .use(rehypeReact, { createElement, components })
                .stringify(transformedNode as any)
            );
            setHtmlBody(
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

      const editor = editorRef.current;
      if (editor != null) {
        const selections = editor.getSelections();
        if (selections != null) {
          editor.executeEdits(
            null,
            selections.map((selection) => ({
              range: selection,
              text: `![${title}](${buffer})`,
              forceMoveMarkers: true
            }))
          );
        } else {
          console.log('Cursor not found');
        }
      } else {
        console.log('Editor not found');
      }
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

  const downloadMarkdown = () => {
    const link = downloadLinkRef.current;
    if (link != null) {
      const type = 'text/plain;charset=utf-8';
      link.href = URL.createObjectURL(new Blob([textOnEditor], { type }));
      link.download = 'index.md';
      link.click();
    } else {
      console.log('Download link not found');
    }
  };

  const downloadHtml = () => {
    const link = downloadLinkRef.current;
    if (link != null) {
      const content = renderToStaticMarkup(
        <html>
          {/* eslint-disable-next-line @next/next/no-head-element */}
          <head lang="ja">
            <meta charSet="UTF-8" />
            <title>Document</title>
            <style dangerouslySetInnerHTML={{ __html: htmlCssText }} />
          </head>
          <body>
            <div className="viewer-root">{Content}</div>
          </body>
        </html>
      );
      const html = `<!DOCTYPE html>${content}`;
      const type = 'text/html;charset=utf-8';
      link.href = URL.createObjectURL(new Blob([html], { type }));
      link.download = 'index.html';
      link.click();
    } else {
      console.log('Download link not found');
    }
  };

  return (
    <div>
      <main>
        <div>
          <p style={{ backgroundColor: '#eeeeee' }}>Control</p>
          <div style={{ display: 'flex' }}>
            <button type="button" onClick={downloadMarkdown}>
              Download Markdown
            </button>
            <button type="button" onClick={downloadHtml}>
              Download HTML
            </button>
          </div>
          <div style={{ display: 'none' }}>
            <a ref={downloadLinkRef}></a>
          </div>
        </div>
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
                width="45vw"
                height="80vh"
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
              />
            </div>
          </div>

          <div>
            <p style={{ backgroundColor: '#eeeeee' }}>Rendered HTML</p>
            <div style={{ height: '80vh', width: '45vw', overflow: 'auto' }}>
              <div className="viewer-root">{Content}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <div>
            <p style={{ backgroundColor: '#eeeeee' }}>Markdown AST</p>
            <div style={{ height: '360px', width: '640px', overflow: 'auto' }}>
              <code>
                <pre>{mdastAsJson}</pre>
              </code>
            </div>
          </div>

          <div>
            <p style={{ backgroundColor: '#eeeeee' }}>HTML AST</p>
            <div style={{ height: '360px', width: '640px', overflow: 'auto' }}>
              <code>
                <pre>{htmlBody}</pre>
              </code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const cssTextViewer = (await readFile('src/styles/viewer.css')).toString('utf8');
  const cssTextHljs = (await readFile('node_modules/highlight.js/styles/default.css')).toString('utf8');
  const htmlCssText = `${cssTextViewer}${cssTextHljs}`;
  return { props: { htmlCssText } };
};

export default Page;
