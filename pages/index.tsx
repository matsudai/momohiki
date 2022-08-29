import type { NextPage } from 'next';
import Head from 'next/head';
import { DownloadButton } from '../components/DownloadButton';
import { Editor } from '../components/Editor';
import { EditorContextProvider } from '../components/EditorContext';
import { Preview } from '../components/Preview';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Markdown Editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <EditorContextProvider>
          <Editor />
          <div className="p-4">
            <Preview />
          </div>
          <DownloadButton />
        </EditorContextProvider>
      </main>
    </>
  );
};

export default Home;
