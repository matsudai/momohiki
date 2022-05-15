import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Heading,
  HeadingProps,
  Link,
  LinkProps,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  TextProps,
  Th,
  Thead,
  Tr,
  UnorderedList
} from '@chakra-ui/react';
import { createElement, FC, useMemo } from 'react';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';

const components = {
  /*
   * Heading (4 - 6 are same level.)
   */
  h1: (props: HeadingProps) => <Heading as="h1" size="2xl" {...props} />,
  h2: (props: HeadingProps) => <Heading as="h2" size="xl" {...props} />,
  h3: (props: HeadingProps) => <Heading as="h3" size="lg" {...props} />,
  h4: (props: HeadingProps) => <Heading as="h4" size="md" {...props} />,
  h5: (props: HeadingProps) => <Heading as="h5" size="md" {...props} />,
  h6: (props: HeadingProps) => <Heading as="h6" size="md" {...props} />,
  /*
   * Link.
   */
  a: ({ children, ...props }: LinkProps) => (
    <Link isExternal {...props}>
      {children}
      <ExternalLinkIcon mx="2px" />
    </Link>
  ),
  /*
   * Table.
   */
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  /*
   * Paragraph.
   */
  p: (props: TextProps) => <Text {...props} />,
  /*
   * Word in paragraph.
   */
  i: (props: TextProps) => <Text as="i" {...props} />,
  u: (props: TextProps) => <Text as="u" {...props} />,
  abbr: (props: TextProps) => <Text as="abbr" {...props} />,
  cite: (props: TextProps) => <Text as="cite" {...props} />,
  // del: (props: TextProps) => <Text as="del" {...props} />,
  em: (props: TextProps) => <Text as="em" {...props} />,
  // ins: (props: TextProps) => <Text as="ins" {...props} />,
  kbd: (props: TextProps) => <Text as="kbd" {...props} />,
  mark: (props: TextProps) => <Text as="mark" {...props} />,
  s: (props: TextProps) => <Text as="s" {...props} />,
  samp: (props: TextProps) => <Text as="samp" {...props} />,
  sub: (props: TextProps) => <Text as="sub" {...props} />,
  sup: (props: TextProps) => <Text as="sup" {...props} />,
  /*
   * Lists.
   */
  ol: OrderedList,
  ul: UnorderedList,
  li: ListItem
};

type HastRendererProps = {
  hast: any;
};

export const HastRenderer: FC<HastRendererProps> = ({ hast }) => {
  const Content = useMemo(() => unified().use(rehypeReact, { createElement, components }).stringify(hast), [hast]);

  return <div>{Content}</div>;
};
