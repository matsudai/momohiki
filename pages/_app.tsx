import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { serverState } from '../mocks';
import { useEffect, useState } from 'react';

if (true /* Usually > process.env.NODE_ENV === 'development' */) {
  import('../mocks').then(({ setupWorker }) => {
    if (typeof window === 'undefined') {
      // Server mode.
    } else {
      // Browser mode.
      setupWorker(window);
    }
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  const [isServerReady, setIsServerReady] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && !isServerReady) {
      const handler = setInterval(() => setIsServerReady(serverState(window) === 'ready'), 1000);
      return () => clearInterval(handler);
    }
  }, [isServerReady]);

  return isServerReady ? <Component {...pageProps} /> : <div>Loading...</div>;
}

export default MyApp;
