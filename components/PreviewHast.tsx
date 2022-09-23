import { FC } from 'react';
import { useEditorHast } from '../lib/editor';

export const PreviewHast: FC = () => {
  const hast = useEditorHast();

  return <div className="w-full h-full p-4">{JSON.stringify(hast)}</div>;
};
