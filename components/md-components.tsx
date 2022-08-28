import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

type ExtendFC<T> = FC<DetailedHTMLProps<HTMLAttributes<T>, T>>;

export const h1: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h1 {...props} className={`text-2xl ${className ?? ''}`} />;
};

export const h2: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h2 {...props} className={`text-xl ${className ?? ''}`} />;
};

export const h3: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h3 {...props} className={`text-lg ${className ?? ''}`} />;
};

export const h4: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h4 {...props} className={`text-base font-bold ${className ?? ''}`} />;
};

export const h5: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h5 {...props} className={`text-base font-bold ${className ?? ''}`} />;
};

export const h6: ExtendFC<HTMLHeadingElement> = ({ className, ...props }) => {
  return <h6 {...props} className={`text-base font-bold ${className ?? ''}`} />;
};

export const a: ExtendFC<HTMLAnchorElement> = ({ className, ...props }) => {
  return <a {...props} className={`${className ?? ''}`} />;
};

export const table: ExtendFC<HTMLTableElement> = ({ className, ...props }) => {
  return <table {...props} className={`${className ?? ''}`} />;
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
  return <th {...props} className={`${className ?? ''}`} />;
};

export const td: ExtendFC<HTMLTableCellElement> = ({ className, ...props }) => {
  return <td {...props} className={`${className ?? ''}`} />;
};

export const p: ExtendFC<HTMLParagraphElement> = ({ className, ...props }) => {
  return <p {...props} className={`${className ?? ''}`} />;
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
  return <blockquote {...props} className={`${className ?? ''}`} />;
};

export const ol: ExtendFC<HTMLOListElement> = ({ className, ...props }) => {
  return <ol {...props} className={`list-inside list-decimal ${className ?? ''}`} />;
};

export const ul: ExtendFC<HTMLUListElement> = ({ className, ...props }) => {
  return <ul {...props} className={`list-inside list-disc ${className ?? ''}`} />;
};

export const li: ExtendFC<HTMLLIElement> = ({ className, ...props }) => {
  return <li {...props} className={`${className ?? ''}`} />;
};

export const hr: ExtendFC<HTMLHRElement> = ({ className, ...props }) => {
  return <hr {...props} className={`${className ?? ''}`} />;
};

export const img: ExtendFC<HTMLImageElement> = ({ className, ...props }) => {
  // eslint-disable-next-line @next/next/no-img-element,jsx-a11y/alt-text
  return <img {...props} className={`${className ?? ''}`} />;
};
