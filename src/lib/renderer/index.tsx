import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Code,
  CodeProps,
  Divider,
  DividerProps,
  Heading,
  HeadingProps,
  Image,
  ImageProps,
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
import * as Markdoc from '@markdoc/markdoc';
import React, { HTMLAttributes } from 'react';

export const tree2component = (node: Markdoc.RenderableTreeNode) => {
  return Markdoc.renderers.react(node, React, {
    components: {
      'X-h1': (props: HeadingProps) => <Heading as="h1" pt="4" pb="2" size="2xl" {...props} />,
      'X-h2': (props: HeadingProps) => <Heading as="h2" pt="4" pb="2" size="xl" {...props} />,
      'X-h3': (props: HeadingProps) => <Heading as="h3" pt="4" pb="2" size="lg" {...props} />,
      'X-h4': (props: HeadingProps) => <Heading as="h4" pt="4" pb="2" size="md" {...props} />,
      'X-h5': (props: HeadingProps) => <Heading as="h5" pt="4" pb="2" size="md" {...props} />,
      'X-h6': (props: HeadingProps) => <Heading as="h6" pt="4" pb="2" size="md" {...props} />,
      'X-a': ({ children, ...props }: LinkProps) => (
        <>
          {props.href?.match(/^[^#]/g) ? (
            <Link isExternal {...props}>
              {children}
              <ExternalLinkIcon mx="2px" />
            </Link>
          ) : (
            <Link {...props}>{children}</Link>
          )}
        </>
      ),
      'X-table': (props: TableProps) => (
        <Box pt="2" pb="4">
          <Table size="sm" {...props} />
        </Box>
      ),
      'X-thead': (props: TableHeadProps) => <Thead {...props} />,
      'X-tbody': (props: TableBodyProps) => <Tbody {...props} />,
      'X-tr': (props: TableRowProps) => <Tr {...props} />,
      'X-th': (props: TableColumnHeaderProps) => <Th {...props} />,
      'X-td': (props: TableCellProps) => <Td {...props} />,
      'X-p': (props: TextProps) => <Text py="2" {...props} />,
      'X-em': (props: TextProps) => <Text as="em" {...props} />,
      'X-s': (props: TextProps) => <Text as="s" {...props} />,
      'X-strong': (props: TextProps) => <Text as="strong" {...props} />,
      'X-blockquote': (props: TextProps) => (
        <Text
          as="blockquote"
          {...props}
          fontStyle="italic"
          fontWeight="semibold"
          pl="4"
          borderStartWidth="thick"
          borderColor="gray.200"
          color="gray.600"
        />
      ),
      'X-ol': (props: ListProps) => <OrderedList {...props} />,
      'X-ul': (props: ListProps) => <UnorderedList {...props} />,
      'X-li': (props: ListItemProps) => <ListItem {...props} />,
      'X-hr': (props: DividerProps) => <Divider {...props} />,
      // eslint-disable-next-line jsx-a11y/alt-text
      'X-img': (props: ImageProps) => <Image {...props} />,
      'X-code': (props: CodeProps) => <Code {...props} />,
      'X-fence': ({
        'data-code': __html,
        children,
        ...props
      }: HTMLAttributes<HTMLPreElement> & { 'data-code': string }) => {
        return <pre {...props} dangerouslySetInnerHTML={{ __html }} />;
      }
    }
  });
};
