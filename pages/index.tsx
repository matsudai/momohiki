import type { NextPage } from 'next';
import Head from 'next/head';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { DownloadButton } from '../components/DownloadButton';
import { Editor } from '../components/Editor';
import { Preview } from '../components/Preview';
import { PreviewHast } from '../components/PreviewHast';
import { PreviewMdast } from '../components/PreviewMdast';

type UsePreviewTypeProps = 'mdast' | 'hast' | 'html';

const usePreviewType = (): [
  UsePreviewTypeProps,
  Dispatch<SetStateAction<UsePreviewTypeProps>>,
  { toMdast: () => void; toHast: () => void; toHtml: () => void }
] => {
  const [type, setType] = useState<UsePreviewTypeProps>('html');

  return [
    type,
    setType,
    {
      toMdast: useCallback(() => setType('mdast'), []),
      toHast: useCallback(() => setType('hast'), []),
      toHtml: useCallback(() => setType('html'), [])
    }
  ];
};

const Home: NextPage = () => {
  const [previewType, _, changePreviewType] = usePreviewType();

  return (
    <>
      <Head>
        <title>Markdown Editor</title>
        <meta name="description" content="Markdown Editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full flex flex-col">
        <div className="flex-grow-0 h-[4rem]">
          <DownloadButton />
          <div className="flex">
            <button type="button" onClick={changePreviewType.toMdast}>
              MDAST
            </button>
            <button type="button" onClick={changePreviewType.toHast}>
              HAST
            </button>
            <button type="button" onClick={changePreviewType.toHtml}>
              HTML
            </button>
          </div>
        </div>
        <div className="flex-grow flex flex-row h-[calc(100vh-4rem)]">
          <div className="flex-1 basis-1/2">
            <Editor />
          </div>
          <div className="flex-1 basis-1/2 overflow-y-auto">
            {previewType === 'mdast' ? <PreviewMdast /> : previewType === 'hast' ? <PreviewHast /> : <Preview />}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
// w-full h-full p-4
