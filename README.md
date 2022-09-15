# Editor

## MEMO

### Next.js (TypeScript)

```sh
yarn create next-app momohiki --typescript

mv momohiki/.eslintrc.json   ./
mv momohiki/.gitignore       ./
# mv momohiki/README.md      ./
mv momohiki/next-env.d.ts    ./
mv momohiki/next.config.js   ./
mv momohiki/node_modules     ./
mv momohiki/package.json     ./
mv momohiki/pages            ./
mv momohiki/public           ./
mv momohiki/styles           ./
mv momohiki/tsconfig.json    ./
mv momohiki/yarn.lock        ./

rm -rf momohiki
```

- package.json

```diff
  "build": "next build",
+ "export": "next build && next export",
  "start": "next start",
```

```diff
  },
- "extensions": [],
+ "extensions": [
+   "dbaeumer.vscode-eslint"
+ ],
  "postCreateCommand": "yarn install",
```

### Prettier

```sh
yarn add -D prettier
```

- .vscode/settings.json

```diff
+ "editor.formatOnSave": false,
+ "[typescript]": {
+   "editor.defaultFormatter": "esbenp.prettier-vscode",
+   "editor.formatOnSave": true
+ },
+ "[typescriptreact]": {
+   "editor.defaultFormatter": "esbenp.prettier-vscode",
+   "editor.formatOnSave": true
+ },
+ "[javascript]": {
+   "editor.defaultFormatter": "esbenp.prettier-vscode",
+   "editor.formatOnSave": true
+ },
+ "[javascriptreact]": {
+   "editor.defaultFormatter": "esbenp.prettier-vscode",
+   "editor.formatOnSave": true
+ },
+ "[css]": {
+   "editor.defaultFormatter": "esbenp.prettier-vscode",
+   "editor.formatOnSave": true
+ }
```

- .devcontainer/devcontainer.json

```diff
  "extensions": [
-   "dbaeumer.vscode-eslint"
+   "dbaeumer.vscode-eslint",
+   "esbenp.prettier-vscode"
  ],
```

- .prettierrc
- .prettierignore

- package.json

```diff
- "lint": "next lint"
+ "lint": "next lint",
+ "fmt": "prettier --write ."
```

### Tailwind

- https://tailwindcss.com/docs/guides/nextjs

```sh
yarn add -D tailwindcss postcss autoprefixer
yarn tailwindcss init -p
```

- .devcontainer/devcontainer.json

```diff
  "extensions": [
    "dbaeumer.vscode-eslint"
-   "esbenp.prettier-vscode"
+   "esbenp.prettier-vscode",
+   "bradlc.vscode-tailwindcss"
  ],
```

- tailwind.config.js

```diff
-   content: [],
+   content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
```

- global.css

```diff
+ @tailwind base;
+ @tailwind components;
+ @tailwind utilities;
-
- ...
```

#### SSG Production

Prepare download html refs `public/output.css` .

- package.json

```diff
  "dev": "next dev",
- "build": "next build",
- "export": "next build && next export",
+ "build": "next build && yarn build-css",
+ "build-css": "postcss styles/globals.css --config postcss.config.js -o public/output.css",
+ "export": "yarn build && next export",
  "start": "next start",
```

### SSG Production

```sh
yarn add -D serve
```

- package.json

```diff
- "fmt": "prettier --write ."
+ "fmt": "prettier --write .",
+ "serve": "serve out"
```

- next.config.js

```diff
- swcMinify: true
+ swcMinify: true,
+ images: {
+   unoptimized: true
+ }
```

### remark/rehype

- Base
    - unified
- Remark
    - remark-gfm
    - remark-parse
    - remark-rehype
- Rehype
    - rehype-highlight
    - rehype-react
    - rehype-sanitize

```sh
yarn add -D unified remark-gfm rehype-highlight remark-parse rehype-react remark-rehype rehype-sanitize
```

- Copy `node_modules/highlight.js/styles/default.css` -> `styles/globals.css`

```diff
@tailwind base;
@tailwind components;
@tailwind utilities;

+ /*!
+   Theme: Default
+   Description: Original highlight.js style
+   Author: (c) Ivan Sagalaev <maniac@softwaremaniacs.org>
+   Maintainer: @highlightjs/core-team
+   Website: https://highlightjs.org/
+   License: see project LICENSE
+   Touched: 2021
+ */
+ pre code.hljs { ...
```

- pages/index.tsx

```diff
+ import { createElement, DetailedHTMLProps, FC, Fragment, HTMLAttributes, ReactNode, useEffect, useState } from 'react';
+ import { unified } from 'unified';
+ import remarkGfm from 'remark-gfm';
+ import rehypeHighlight from 'rehype-highlight';
+ import remarkParse from 'remark-parse';
+ import rehypeReact from 'rehype-react';
+ import remarkRehype from 'remark-rehype';
+ import rehypeSanitize from 'rehype-sanitize';
+
+ const formatter = unified()
+   .use(remarkParse)
+   .use(remarkGfm)
+   .use(remarkRehype)
+   .use(rehypeSanitize)
+   .use(rehypeHighlight)
+   .use(rehypeReact, { createElement, Fragment, components: {} });
+
+ interface IData {
+   text: string;
+   mdast?: ReturnType<typeof formatter['parse']>;
+   hast?: Awaited<ReturnType<typeof formatter['run']>>;
+   content?: ReactNode;
+ }

// ...

+ const [data, setData] = useState<IData>({ text: '' });
+
+ useEffect(() => {
+   const mdast = formatter.parse(data.text);
+   formatter.run(mdast).then((hast) => {
+     const content = formatter.stringify(hast);
+     setData((data) => ({ ...data, mdast, hast, content }));
+   });
+ }, [data.text]);

// ...

  <main>
+   <textarea value={data.text} onChange={({ target: { value: text } }) => setData((data) => ({ ...data, text }))} />
+   {data.content}
  </main>
```

### Monaco Editor (UNOFFICIAL)

!! Official Monaco Editor cannot be used on Next.js.

```sh
yarn add -D @monaco-editor/react

# Use node_modules/monaco-editor/min/vs instead of CDN
yarn add -D monaco-editor copy-webpack-plugin
```

### MSW (Mock Service Worker)

- https://mswjs.io/docs/getting-started/install
- https://github.com/vercel/next.js/tree/canary/examples/with-msw

```sh
yarn add -D msw

# Generate `public/mockServiceWorker.js`
yarn msw init public
```

- mocks/index.ts

```ts
import { rest, setupWorker as setupMsw } from 'msw';

const handlers = [
  rest.get('/mocks/xxx', (req, res, ctx) => {
    return res(ctx.status(200), ctx.body('API response.'));
  })
];

interface IWindow {
  mswRegistrationStatus?: 'loading' | 'ready';
}

export const serverState = (window: any) => (window as IWindow).mswRegistrationStatus;

export const setupWorker = async (window: any) => {
  (window as IWindow).mswRegistrationStatus = 'loading';

  const worker = await setupMsw(...handlers).start({
    // Supress errors when no mocked pathes are accessed.
    onUnhandledRequest: 'bypass'
  });

  (window as IWindow).mswRegistrationStatus = 'ready';

  return worker;
};
```

- pages/index.tsx

```ts
import { serverState } from '../mocks';

if (true /* Usually > process.env.NODE_ENV === 'development' */) {
  import('../mocks').then(({ setupWorker }) => {
    if (typeof window === 'undefined') {
      // Server mode.
    } else {
      // Browser mode.
      setupWorker(window);
    }
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  const [isServerReady, setIsServerReady] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && !isServerReady) {
      const handler = setInterval(() => setIsServerReady(serverState(window) === 'ready'), 1000);
      return () => clearInterval(handler);
    }
  }, [isServerReady]);

  return isServerReady ? <Component {...pageProps} /> : <div>Loading...</div>;
}
```
