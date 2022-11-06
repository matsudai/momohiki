import { renderToString } from 'react-dom/server';
import { FC, useRef, useState } from 'react';
import { useEditorComponent } from '../lib/editor';
import { TopicTree } from './TopicTree';

export const DownloadButton: FC = () => {
  const component = useEditorComponent();
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [cssCache, setCssCache] = useState<string>();

  const download = async () => {
    const link = downloadLinkRef.current;
    if (link != null) {
      const css = cssCache ?? (await (await fetch('/output.css')).text());
      if (cssCache == null) {
        setCssCache(css);
      }
      const html = renderToString(
        <html>
          {/* eslint-disable-next-line @next/next/no-head-element */}
          <head lang="ja">
            <style dangerouslySetInnerHTML={{ __html: css }} />
          </head>
          <body>
            <main className="flex h-screen">
              <div className="flex-1 flex-grow-0 p-4">
                <div className="w-48 h-full overflow-y-auto">
                  <TopicTree />
                </div>
              </div>
              <div className="flex-1 h-screen p-4 overflow-y-auto">{component}</div>
            </main>
          </body>
        </html>
      );
      const type = 'text/plain;charset=utf-8';
      link.href = URL.createObjectURL(new Blob([html], { type }));
      link.download = 'index.html';
      link.click();
    } else {
      console.error('Download link is not found');
    }
  };

  return (
    <div>
      <button type="button" onClick={download}>
        Download
      </button>
      <a className="hidden" href="#" ref={downloadLinkRef} />
    </div>
  );
};
