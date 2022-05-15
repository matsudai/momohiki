import type { NextPage } from 'next';
import { ClipboardEventHandler, DragEventHandler, SyntheticEvent, useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { Root } from 'rehype-highlight/lib';
import { md2Hast } from '../lib/parser';
import { HastRenderer } from '../lib/renderer';

loader.config({ paths: { vs: '/monaco-editor/min/vs' } });

type EditorInstance = Parameters<Extract<Parameters<typeof Editor>[0]['onMount'], Function>>[0];

const initialTextOnEditor = '# Hello World\n\nWelcome to my page 👀\n';

const Page: NextPage = () => {
  const [textOnEditor, setTextOnEditor] = useState(initialTextOnEditor);
  const [Content, setContent] = useState(() => <div />);
  const [htmlBody, setHtmlBody] = useState<string>('');
  const [mdastAsJson, setMdAstAsJson] = useState<string>('');
  const [hast, setHast] = useState<Root>();
  const editorRef = useRef<EditorInstance | null>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    md2Hast(textOnEditor).then(setHast);
    // const mdast = unified().use(remarkParse).use(remarkGfm).parse(textOnEditor);
    // setMdAstAsJson(JSON.stringify(mdast, null, 2));

    // const components = {
    //   /*
    //    * Heading (4 - 6 are same level.)
    //    */
    //   h1: (props: HeadingProps) => <Heading as="h1" size="2xl" {...props} />,
    //   h2: (props: HeadingProps) => <Heading as="h2" size="xl" {...props} />,
    //   h3: (props: HeadingProps) => <Heading as="h3" size="lg" {...props} />,
    //   h4: (props: HeadingProps) => <Heading as="h4" size="md" {...props} />,
    //   h5: (props: HeadingProps) => <Heading as="h5" size="md" {...props} />,
    //   h6: (props: HeadingProps) => <Heading as="h6" size="md" {...props} />,
    //   /*
    //    * Link.
    //    */
    //   a: ({ children, ...props }: LinkProps) => (
    //     <Link isExternal {...props}>
    //       {children}
    //       <ExternalLinkIcon mx="2px" />
    //     </Link>
    //   ),
    //   /*
    //    * Table.
    //    */
    //   table: Table,
    //   thead: Thead,
    //   tbody: Tbody,
    //   tr: Tr,
    //   th: Th,
    //   td: Td,
    //   /*
    //    * Paragraph.
    //    */
    //   p: (props: TextProps) => <Text {...props} />,
    //   /*
    //    * Word in paragraph.
    //    */
    //   i: (props: TextProps) => <Text as="i" {...props} />,
    //   u: (props: TextProps) => <Text as="u" {...props} />,
    //   abbr: (props: TextProps) => <Text as="abbr" {...props} />,
    //   cite: (props: TextProps) => <Text as="cite" {...props} />,
    //   // del: (props: TextProps) => <Text as="del" {...props} />,
    //   em: (props: TextProps) => <Text as="em" {...props} />,
    //   // ins: (props: TextProps) => <Text as="ins" {...props} />,
    //   kbd: (props: TextProps) => <Text as="kbd" {...props} />,
    //   mark: (props: TextProps) => <Text as="mark" {...props} />,
    //   s: (props: TextProps) => <Text as="s" {...props} />,
    //   samp: (props: TextProps) => <Text as="samp" {...props} />,
    //   sub: (props: TextProps) => <Text as="sub" {...props} />,
    //   sup: (props: TextProps) => <Text as="sup" {...props} />,
    //   /*
    //    * Lists.
    //    */
    //   ol: OrderedList,
    //   ul: UnorderedList,
    //   li: ListItem
    // };

    try {
      // unified()
      //   .use(remarkRehype)
      //   .use(rehypeHightlight, { ignoreMissing: true, subset: false }) // 言語が見つからないエラーを無視、言語の推測を無効
      //   .run(mdast, (error, transformedNode) => {
      //     setHast(transformedNode);
      //     if (error != null || transformedNode == null) {
      //       console.log(error);
      //     } else {
      //       setContent(
      //         unified()
      //           .use(rehypeReact, { createElement, components })
      //           .stringify(transformedNode as any)
      //       );
      //       setHtmlBody(
      //         unified()
      //           .use(rehypeStringify)
      //           .stringify(transformedNode as any) as any
      //       );
      //     }
      //   });
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

  const downloadHtml = async () => {
    const link = downloadLinkRef.current;
    if (link != null) {
      const type = 'text/html;charset=utf-8';
      const template = await (await fetch('/static-templates/index.html')).text();
      const html = template.replaceAll(
        /<script type="application\/json" id="app-source">.*<\/script>/g,
        `<script type="application/json" id="app-source">${JSON.stringify(hast)}</script>`
      );
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
              {hast == null ? null : <HastRenderer hast={hast} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
