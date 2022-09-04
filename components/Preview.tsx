import { FC } from 'react';
import { useEditorContext } from './EditorContext';

export const Preview: FC = () => {
  const { data } = useEditorContext();

  return <div className="w-full h-full">{data.content}</div>;
};
