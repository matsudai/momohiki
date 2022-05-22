import type { NextPage } from 'next';
import { ClipboardEventHandler, DragEventHandler, SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { Box } from '@chakra-ui/react';
import { ast2tree, md2ast } from '../lib/parser';
import { tree2component } from '../lib/renderer';

loader.config({ paths: { vs: '/monaco-editor/min/vs' } });

type EditorInstance = Parameters<Extract<Parameters<typeof Editor>[0]['onMount'], Function>>[0];

const initialTextOnEditor = '# Title\n\nHello Documents.';

const Page: NextPage = () => {
  const [textOnEditor, setTextOnEditor] = useState(initialTextOnEditor);
  const editorRef = useRef<EditorInstance | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [content, component] = useMemo(() => {
    const ast = md2ast(textOnEditor);
    const content = ast2tree(ast);
    const component = tree2component(content);
    return [content, component];
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
      const template = await (await fetch('/static-templates/template.html')).text();
      const html = template.replaceAll(
        /<script type="application\/json" id="app-source">.*<\/script>/g,
        `<script type="application/json" id="app-source">${JSON.stringify(content)}</script>`
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
                // defaultLanguage="markdoc"
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
                  editorRef.current.onDidChangeCursorPosition((event) => {
                    if (event.source === 'mouse' || event.source === 'keyboard') {
                      // const preview = previewRef.current;
                      // if (preview != null) {
                      //   const targetNode = preview.querySelector<HTMLElement>(
                      //     `[data-md-position-start-line="${event.position.lineNumber}"]`
                      //   );
                      //   if (targetNode != null) {
                      //     console.log([preview.scrollTop, targetNode.offsetTop, preview.offsetTop]);
                      //     preview.scrollTop = targetNode.offsetTop - preview.offsetTop - preview.offsetHeight / 2;
                      //   }
                      // }
                    }
                  });
                }}
              />
            </div>
          </div>
          <div>
            <p style={{ backgroundColor: '#eeeeee' }}>Rendered HTML</p>
            <div style={{ height: '80vh', width: '45vw', overflow: 'auto' }} ref={(ref) => (previewRef.current = ref)}>
              <Box w="45vw" h="80vh" overflow="auto" p="4">
                {component}
              </Box>
              {/* {hast == null ? null : (
                <HastRenderer
                  hast={hast.hast}
                  // onElementClicked={() => {
                  //   const editor = editorRef.current;
                  //   if (editor != null) {
                  //     const currentLine = editor.getPosition()?.lineNumber;
                  //     if (currentLine !== line) {
                  //       editor.setPosition({ lineNumber: line, column: 0 });
                  //     }
                  //     if (currentLine != null) {
                  //       const visibleRanges = editor.getVisibleRanges() ?? [];
                  //       const isCursorVisible = visibleRanges.some(
                  //         ({ startLineNumber, endLineNumber }) =>
                  //           startLineNumber <= currentLine && currentLine <= endLineNumber
                  //       );
                  //       if (!isCursorVisible) {
                  //         editor.revealLineInCenter(line);
                  //       }
                  //     }
                  //   }
                  // }}
                />
              )} */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
