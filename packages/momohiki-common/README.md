# Markdown transfer and hast viewer

## MEMO

### Prettier settings

0. (This file is already exists in `../../.vscode/`) add `.vscode/settings` for prettier.
1. add `.prettierrc`
2. add `.prettierignore`

### Typescript, Parcel and React

1. Install typescript, parcel and react.

```txt
yarn workspace momohiki-common add -D typescript parcel react react-dom @types/react @types/react-dom
```

2. Add `.gitignore`

```txt
/.parcel-cache        # Parcel build cache.
/node_modules         # Packages.
/tsconfig.tsbuildinfo # tsc check cache.
```

3. Add scripts to `package.json`

```diff
  {
    ...
+   "source": "src/sample.html",
+   "scripts": {
+     "dev": "parcel --cache-dir ./.parcel-cache --no-autoinstall",
+   },
    ...
  }
```

4. Add tsconfig, HTML and TS files.

* add `tsconfig.json`

* add `src/sample.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My Parcel App</title>
  </head>
  <body>
    <div id="app">...loading...</div>
    <script type="module">
      import { createRoot } from 'react-dom/client';
      import { App } from './index.tsx';

      const container = document.getElementById('app');
      if (container) {
        const root = createRoot(container);
        root.render(<App />);
      }
    </script>
  </body>
</html>
```

* add `src/index.tsx`

```tsx
import { FC } from 'react';

export const App: FC = () => {
  return <div>Hello World</div>;
};
```

