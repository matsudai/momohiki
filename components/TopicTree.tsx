import Link from 'next/link';
import { FC, ReactNode, useCallback } from 'react';
import { ITopic } from '../lib/translation';
import { useEditorCursor, useEditorTopicTree } from '../lib/editor';

export interface TopicProps {
  topic?: ITopic;
}

export const TopicText: FC<{ level: number; children: ReactNode; disabled?: boolean }> = ({ level, children, disabled = false }) => (
  <p
    className={`w-full truncate ${disabled ? 'text-gray-500 text-center' : ''} ${
      level === 1
        ? 'pl-0'
        : level === 2
        ? 'pl-4'
        : level === 3
        ? 'pl-8'
        : level === 4
        ? 'pl-12'
        : level === 5
        ? 'pl-16'
        : level === 5
        ? 'pl-20'
        : level === 6
        ? 'pl-24'
        : ''
    }`}
  >
    {children}
  </p>
);

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
    <TopicText level={1} disabled>
      No Topics
    </TopicText>
  ) : (
    <Link href={`#${topic.htmlId}`} onClick={moveToPos}>
      <TopicText level={topic.level}>{topic.headingText}</TopicText>
    </Link>
  );
};

export interface TopicTreeProps {}

export const TopicTree: FC<TopicTreeProps> = () => {
  const topics = useEditorTopicTree();

  return (
    <div className="flex flex-col p-1 gap-1">
      {topics == null || topics.length === 0 ? <Topic /> : topics.map((topic) => <Topic key={topic.htmlId} topic={topic} />)}
    </div>
  );
};
