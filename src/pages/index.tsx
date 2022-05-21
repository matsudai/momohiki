import type { NextPage } from 'next';
import { ClipboardEventHandler, DragEventHandler, SyntheticEvent, useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { Root } from 'rehype-highlight/lib';
import { md2Hast } from '../lib/parser';
import { HastRenderer } from '../lib/renderer';

loader.config({ paths: { vs: '/monaco-editor/min/vs' } });

type EditorInstance = Parameters<Extract<Parameters<typeof Editor>[0]['onMount'], Function>>[0];

const initialTextOnEditor =
  '---\n__Advertisement :)__\n\n- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image\n  resize in browser.\n- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly\n  i18n with plurals support and easy syntax.\n\nYou will like those projects!\n\n---\n\n# h1 Heading 8-)\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n\n\n## Horizontal Rules\n\n___\n\n---\n\n***\n\n\n## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n"Smartypants, double quotes" and \'single quotes\'\n\n\n## Emphasis\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n~~Strikethrough~~\n\n\n## Blockquotes\n\n\n> Blockquotes can also be nested...\n>> ...by using additional greater-than signs right next to each other...\n> > > ...or with spaces between arrows.\n\n\n## Lists\n\nUnordered\n\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n  - Marker character change forces new list start:\n    * Ac tristique libero volutpat at\n    + Facilisis in pretium nisl aliquet\n    - Nulla volutpat aliquam velit\n+ Very easy!\n\nOrdered\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\nStart numbering with offset:\n\n57. foo\n1. bar\n\n\n## Code\n\nInline `code`\n\nIndented code\n\n    // Some comments\n    line 1 of code\n    line 2 of code\n    line 3 of code\n\n\nBlock code "fences"\n\n```\nSample text here...\n```\n\nSyntax highlighting\n\n``` js\nvar foo = function (bar) {\n  return bar++;\n};\n\nconsole.log(foo(5));\n```\n\n## Tables\n\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\nRight aligned columns\n\n| Option | Description |\n| ------:| -----------:|\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\n\n## Links\n\n[link text](http://dev.nodeca.com)\n\n[link with title](http://nodeca.github.io/pica/demo/ "title text!")\n\nAutoconverted link https://github.com/nodeca/pica (enable linkify to see)\n\n\n## Images\n\n![Minion](https://octodex.github.com/images/minion.png)\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")\n\nLike links, Images also have a footnote style syntax\n\n![Alt text][id]\n\nWith a reference later in the document defining the URL location:\n\n[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"\n\n\n## Plugins\n\nThe killer feature of `markdown-it` is very effective support of\n[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).\n\n\n### [Emojies](https://github.com/markdown-it/markdown-it-emoji)\n\n> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:\n>\n> Shortcuts (emoticons): :-) :-( 8-) ;)\n\nsee [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.\n\n\n### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)\n\n- 19^th^\n- H~2~O\n\n\n### [<ins>](https://github.com/markdown-it/markdown-it-ins)\n\n++Inserted text++\n\n\n### [<mark>](https://github.com/markdown-it/markdown-it-mark)\n\n==Marked text==\n\n\n### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)\n\nFootnote 1 link[^first].\n\nFootnote 2 link[^second].\n\nInline footnote^[Text of inline footnote] definition.\n\nDuplicated footnote reference[^second].\n\n[^first]: Footnote **can have markup**\n\n    and multiple paragraphs.\n\n[^second]: Footnote text.\n\n\n### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)\n\nTerm 1\n\n:   Definition 1\nwith lazy continuation.\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n_Compact style:_\n\nTerm 1\n  ~ Definition 1\n\nTerm 2\n  ~ Definition 2a\n  ~ Definition 2b\n\n\n### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)\n\nThis is HTML abbreviation example.\n\nIt converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.\n\n*[HTML]: Hyper Text Markup Language\n\n### [Custom containers](https://github.com/markdown-it/markdown-it-container)\n\n::: warning\n*here be dragons*\n:::\n';

const Page: NextPage = () => {
  const [textOnEditor, setTextOnEditor] = useState(initialTextOnEditor);
  const [hast, setHast] = useState<{ hast: Root; index: { key: string; text: string }[] }>();
  const editorRef = useRef<EditorInstance | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    md2Hast(initialTextOnEditor).then(setHast);
  }, []);

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
                onChange={async (value) => {
                  setTextOnEditor(value ?? '');
                  setHast(await md2Hast(value ?? ''));
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
              {hast == null ? null : (
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
