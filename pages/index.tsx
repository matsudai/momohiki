import type { NextPage } from 'next';
import Head from 'next/head';
import { DownloadButton } from '../components/DownloadButton';
import { Editor } from '../components/Editor';
import { Preview } from '../components/Preview';

const Home: NextPage = () => {
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
        </div>
        <div className="flex-grow flex flex-row h-[calc(100vh-4rem)]">
          <div className="flex-1 basis-1/2">
            <Editor />
          </div>
          <div className="flex-1 basis-1/2 overflow-y-auto">
            <Preview />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
