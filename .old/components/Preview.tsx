import { FC } from 'react';
import { useEditorComponent } from '../lib/editor';

export const Preview: FC = () => {
  const component = useEditorComponent();

  return <div className="w-full h-full p-4">{component}</div>;
};
