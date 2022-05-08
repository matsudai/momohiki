import { ChakraProvider, Heading, HeadingProps } from '@chakra-ui/react';
import { createElement, FC, useEffect, useState } from 'react';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';

interface AppProps {
  hast: any;
}

const components = {
  h1: (props: HeadingProps) => <Heading as="h1" {...props} />
};

export const App: FC<AppProps> = ({ hast }) => {
  const [Content, setContent] = useState(() => <div />);

  useEffect(() => {
    setContent(unified().use(rehypeReact, { createElement, components }).stringify(hast));
  }, [hast]);

  return (
    <ChakraProvider>
      <div>{Content}</div>
    </ChakraProvider>
  );
};
