# Standalone HTML Viewer

## MEMO

### Prettier settings

0. (This file is already exists in `../../.vscode/`) add `.vscode/settings` for prettier.
1. add `.prettierrc`
2. add `.prettierignore`

### Typescript, Parcel and React

1. Install typescript, parcel and react.

```txt
npm -w momohiki-viewer i -D typescript parcel react react-dom @types/react @types/react-dom
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

