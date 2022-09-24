import type { NextPage } from 'next';
import Head from 'next/head';
import { ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import { DownloadButton } from '../components/DownloadButton';
import { EditorMd } from '../components/EditorMarkdown';
import { Preview } from '../components/Preview';
import { PreviewHast } from '../components/PreviewHast';
import { PreviewMdast } from '../components/PreviewMdast';

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
const Tab: FC<Pick<ButtonProps, 'onClick' | 'children'>> = (props) => {
  return <button type="button" className="min-w-[4rem]" {...props} />;
};

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
            <Tab onClick={changePreviewType.toMdast}>MDAST</Tab>
            <Tab onClick={changePreviewType.toHast}>HAST</Tab>
            <Tab onClick={changePreviewType.toHtml}>HTML</Tab>
          </div>
        </div>
        <div className="flex-grow flex flex-row h-[calc(100vh-4rem)]">
          <div className="flex-1 basis-1/2">
            <EditorMd />
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
