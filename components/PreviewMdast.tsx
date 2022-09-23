import { FC } from 'react';
import { useEditorMdast } from '../lib/editor';

export const PreviewMdast: FC = () => {
  const mdast = useEditorMdast();

  return <div className="w-full h-full p-4">{JSON.stringify(mdast)}</div>;
};
