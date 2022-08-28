import { createContext, createElement, Dispatch, FC, Fragment, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export const formatter = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeHighlight)
  .use(rehypeReact, { createElement, Fragment, components: {} });

export interface IData {
  text: string;
  mdast?: ReturnType<typeof formatter['parse']>;
  hast?: Awaited<ReturnType<typeof formatter['run']>>;
  content?: ReactNode;
}

const Context = createContext<{ data: IData; setData: Dispatch<SetStateAction<IData>> } | undefined>(undefined);

export const EditorContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<IData>({ text: '' });

  useEffect(() => {
    const mdast = formatter.parse(data.text);
    formatter.run(mdast).then((hast) => {
      const content = formatter.stringify(hast);
      setData((data) => ({ ...data, mdast, hast, content }));
      console.log(JSON.stringify(hast, null, 2));
    });
  }, [data.text]);

  return <Context.Provider value={{ data, setData }}>{children}</Context.Provider>;
};

export const useEditorContext = () => {
  const rval = useContext(Context);
  if (rval == null) {
    throw Error('Not impl');
  }
  return rval;
};
