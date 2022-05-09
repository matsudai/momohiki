# Standalone HTML Viewer

## MEMO

### Prettier settings

0. (This file is already exists in `../../.vscode/`) add `.vscode/settings` for prettier.
1. add `.prettierrc`
2. add `.prettierignore`

### Typescript, Parcel and React

1. Install typescript, parcel and react.

```txt
yarn workspace momohiki-viewer add -D typescript parcel react react-dom @types/react @types/react-dom
```

2. Add `.gitignore`

```txt
/.parcel-cache        # Parcel build cache.
/dist                 # Parcel build results.
/tsconfig.tsbuildinfo # tsc check cache.
```

3. Add scripts to `package.json`

```diff
  {
    ...
+   "source": "src/index.html",
+   "scripts": {
+     "dev": "parcel --cache-dir ./.parcel-cache --no-autoinstall",
+     "build": "rm -rf dist && parcel build --cache-dir ./.parcel-cache --no-autoinstall",
+     "check": "tsc --noEmit"
+   },
    ...
  }
```

4. Add tsconfig, HTML and TS files.

* add `tsconfig.json`

* add `src/index.html`

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
      import './index.tsx'
    </script>
  </body>
</html>
```

* add `src/index.tsx`

```tsx
import { createRoot } from 'react-dom/client';
import { App } from './App';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
```

* add `src/App.tsx`

```tsx
import { FC } from 'react';

export const App: FC = () => {
  return <div>Hello World</div>;
};
```

### Parcel validator

(this package is EXPERIMENTAL)

1. Install parcel validator.

```txt
yarn workspace momohiki-viewer add -D @parcel/validator-typescript @parcel/config-default
```

2. Add `.parcelrc`

### Chakra UI

1. Install Chakra-ui.

```txt
yarn workspace momohiki-viewer add -D @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^6
yarn workspace momohiki-viewer add -D @chakra-ui/icons react-icons
```

2. Install dependencies for parcel

```txt
yarn workspace momohiki-viewer add -D process
```

3. setup Chakra UI -> ref official page

### Renderer

1. Install Rehype-React and highlight.js

```txt
yarn workspace momohiki-viewer add -D unified rehype-react highlight.js
```
