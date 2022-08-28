import { renderToString } from 'react-dom/server';
import { FC, useRef, useState } from 'react';
import { useEditorContext } from './EditorContext';

export const DownloadButton: FC = () => {
  const { data } = useEditorContext();
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
          <head>
            <style dangerouslySetInnerHTML={{ __html: css }} />
          </head>
          <body>
            <main>{data.content}</main>
          </body>
        </html>
      );
      const type = 'text/plain;charset=utf-8';
      link.href = URL.createObjectURL(new Blob([html], { type }));
      link.download = 'index.html';
      link.click();
    } else {
      console.log('Download link is not found');
    }
  };

  return (
    <div>
      <button type="button" onClick={download}>
        Download
      </button>
      <a className="hidden" ref={downloadLinkRef} />
    </div>
  );
};