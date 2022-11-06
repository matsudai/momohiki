import Link from 'next/link';
import { FC, useCallback } from 'react';
import { ITopic } from '../lib/document-transformer';
import { useEditorCursor, useEditorTopicTree } from '../lib/editor';

export interface TopicProps {
  topic?: ITopic;
}

export const Topic: FC<TopicProps> = ({ topic }) => {
  const [_, setCursor] = useEditorCursor();
  const isEmpty = topic == null;

  const moveToPos = useCallback(() => {
    const position = topic?.position;
    if (position != null) {
      setCursor(position.start);
    }
  }, [topic, setCursor]);

  return isEmpty ? (
    <p className="w-32 text-gray-500 text-center">No Topics</p>
  ) : (
    <Link href={`#${topic?.htmlId ?? ''}`} onClick={moveToPos}>
      <p
        className={`w-32 ${
          topic.level === 1
            ? 'pl-0'
            : topic.level === 2
            ? 'pl-1'
            : topic.level === 3
            ? 'pl-2'
            : topic.level === 4
            ? 'pl-3'
            : topic.level === 5
            ? 'pl-4'
            : topic.level === 5
            ? 'pl-6'
            : topic.level === 6
            ? 'pl-7'
            : ''
        }`}
      >
        {topic.headingText}
      </p>
    </Link>
  );
};

export interface TopicTreeProps {}

export const TopicTree: FC<TopicTreeProps> = () => {
  const topics = useEditorTopicTree();

  return (
    <div className="flex flex-col">
      {topics == null || topics.length === 0 ? <Topic /> : topics.map((topic) => <Topic key={topic.htmlId} topic={topic} />)}
    </div>
  );
};
