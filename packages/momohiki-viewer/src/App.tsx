import { ChakraProvider, Heading } from '@chakra-ui/react';
import { FC } from 'react';

export const App: FC = () => {
  return (
    <ChakraProvider>
      <Heading as="h1">Hello World</Heading>
    </ChakraProvider>
  );
};
