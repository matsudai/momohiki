import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Heading,
  HeadingProps,
  Link,
  LinkProps,
  ListItem,
  ListItemProps,
  ListProps,
  OrderedList,
  Table,
  TableBodyProps,
  TableCellProps,
  TableColumnHeaderProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
  Tbody,
  Td,
  Text,
  TextProps,
  Th,
  Thead,
  Tr,
  UnorderedList
} from '@chakra-ui/react';
import { createElement, FC, useCallback, useMemo } from 'react';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';

type HastRendererProps = {
  hast: any;
};

export const HastRenderer: FC<HastRendererProps> = ({ hast }) => {
  // const clickEvent = useCallback(
  //   (props: { [key: string]: any }) => (event: MouseEvent<HTMLElement>) => {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     try {
  //       const pos = JSON.parse(props['data-md-position-start']);
  //       console.log(pos);
  //       if (typeof pos.line === 'number' && typeof pos.column === 'number') {
  //         // onElementClicked?.({ position: { start: pos } });
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   []
  // );

  const components = useMemo(
    () => ({
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
      table: (props: TableProps) => <Table {...props} />,
      thead: (props: TableHeadProps) => <Thead {...props} />,
      tbody: (props: TableBodyProps) => <Tbody {...props} />,
      tr: (props: TableRowProps) => <Tr {...props} />,
      th: (props: TableColumnHeaderProps) => <Th {...props} />,
      td: (props: TableCellProps) => <Td {...props} />,
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
      // del: (props: TextProps) => <Text as="del" {...props}  />,
      em: (props: TextProps) => <Text as="em" {...props} />,
      // ins: (props: TextProps) => <Text as="ins" {...props}  />,
      kbd: (props: TextProps) => <Text as="kbd" {...props} />,
      mark: (props: TextProps) => <Text as="mark" {...props} />,
      s: (props: TextProps) => <Text as="s" {...props} />,
      samp: (props: TextProps) => <Text as="samp" {...props} />,
      sub: (props: TextProps) => <Text as="sub" {...props} />,
      sup: (props: TextProps) => <Text as="sup" {...props} />,
      /*
       * Lists.
       */
      ol: (props: ListProps) => <OrderedList {...props} />,
      ul: (props: ListProps) => <UnorderedList {...props} />,
      li: (props: ListItemProps) => <ListItem {...props} />
    }),
    []
  );

  const Content = useMemo(
    () => unified().use(rehypeReact, { createElement, components }).stringify(hast),
    [hast, components]
  );

  return <div>{Content}</div>;
};
