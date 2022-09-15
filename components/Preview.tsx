import { FC } from 'react';
import { useEditorState } from '../lib/storage';

export const Preview: FC = () => {
  const [{ content }] = useEditorState();

  return <div className="w-full h-full p-4">{content}</div>;
};
