import { AnchorHTMLAttributes, DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { ArrowTopRightOnSquareBtn } from './icons';

type ExtendFC<T> = FC<DetailedHTMLProps<HTMLAttributes<T>, T>>;

export const h1: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h1 {...props} className={`text-4xl py-2 ${className ?? ''}`} />;
};

export const h2: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h2 {...props} className={`text-3xl py-2 ${className ?? ''}`} />;
};

export const h3: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h3 {...props} className={`text-2xl py-2 ${className ?? ''}`} />;
};

export const h4: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h4 {...props} className={`text-xl py-2 ${className ?? ''}`} />;
};

export const h5: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h5 {...props} className={`text-lg py-2 ${className ?? ''}`} />;
};

export const h6: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h6 {...props} className={`text-base font-bold py-2 ${className ?? ''}`} />;
};

export const a: FC<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>> = ({ className, children, ...props }) => {
  return props.href?.match(/^#/) ? (
    <a {...props} className={`group text-blue-600 underline ${className ?? ''}`}>
      {children}
    </a>
  ) : (
    <a {...props} target="_blank" className={`group text-blue-600 underline ${className ?? ''}`}>
      {children}
      <ArrowTopRightOnSquareBtn className="pl-2 hidden group-hover:inline-block" />
    </a>
  );
};

export const table: ExtendFC<HTMLTableElement> = ({ className, ...props }) => {
  return <table {...props} className={`border-y-2 py-2 ${className ?? ''}`} />;
};

export const thead: ExtendFC<HTMLTableSectionElement> = ({ className, ...props }) => {
  return <thead {...props} className={`${className ?? ''}`} />;
};

export const tbody: ExtendFC<HTMLTableSectionElement> = ({ className, ...props }) => {
  return <tbody {...props} className={`${className ?? ''}`} />;
};

export const tr: ExtendFC<HTMLTableRowElement> = ({ className, ...props }) => {
  return <tr {...props} className={`${className ?? ''}`} />;
};

export const th: ExtendFC<HTMLTableCellElement> = ({ className, ...props }) => {
  return <th {...props} className={`px-4 py-2 border-b-2 border-gray-200 ${className ?? ''}`} />;
};

export const td: ExtendFC<HTMLTableCellElement> = ({ className, ...props }) => {
  return <td {...props} className={`px-4 py-2 ${className ?? ''}`} />;
};

export const p: ExtendFC<HTMLParagraphElement> = ({ className, ...props }) => {
  return <p {...props} className={`py-2 ${className ?? ''}`} />;
};

export const em: ExtendFC<HTMLElement> = ({ className, ...props }) => {
  return <em {...props} className={`${className ?? ''}`} />;
};

export const s: ExtendFC<HTMLElement> = ({ className, ...props }) => {
  return <s {...props} className={`${className ?? ''}`} />;
};

export const strong: ExtendFC<HTMLElement> = ({ className, ...props }) => {
  return <strong {...props} className={`${className ?? ''}`} />;
};

export const blockquote: ExtendFC<HTMLQuoteElement> = ({ className, ...props }) => {
  return <blockquote {...props} className={`pl-2 border-l-4 border-solid border-gray-200 bg-gray-100 italic ${className ?? ''}`} />;
};

export const ol: ExtendFC<HTMLOListElement> = ({ className, ...props }) => {
  return <ol {...props} className={`pl-4 py-2 list-decimal ${className ?? ''}`} />;
};

export const ul: ExtendFC<HTMLUListElement> = ({ className, ...props }) => {
  return <ul {...props} className={`pl-4 py-2 list-disc ${className ?? ''}`} />;
};

export const li: ExtendFC<HTMLLIElement> = ({ className, ...props }) => {
  return <li {...props} className={`${className ?? ''}`} />;
};

export const hr: ExtendFC<HTMLHRElement> = ({ className, ...props }) => {
  return <hr {...props} className={`py-2 ${className ?? ''}`} />;
};

export const img: ExtendFC<HTMLImageElement> = ({ className, ...props }) => {
  // eslint-disable-next-line @next/next/no-img-element,jsx-a11y/alt-text
  return <img {...props} className={`${className ?? ''}`} />;
};

export const code: ExtendFC<HTMLElement> = ({ className, ...props }) => {
  return <code {...props} className={`bg-gray-100 ${className ?? ''}`} />;
};
