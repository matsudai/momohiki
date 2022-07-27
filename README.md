# MD Editor

## Install

### Next.js

```sh
yarn create next-app momohiki --typescript
```

```diff
      "build": "next build",
+     "export": "next build && next export",
      "start": "next start",
```

### Prettier

- .vscode/settings.json
- .devcontainer/devcontainer.json
- .prettierrc
- .prettierignore

```diff
      "lint": "next lint",
+     "format": "prettier --write ."
```

### Parcel (Viewer)

```sh
yarn add -D parcel @parcel/config-default @parcel/transformer-typescript-tsc @parcel/validator-typescript
```

- .gitignore (/public/viewer/template.html)
- .prettierignore (/public/viewer/template.html)
- .parcelrc

- package.json

```diff
+     "dev:viewer": "parcel viewer/template.html --dist-dir public/viewer --cache-dir /tmp/.parcel-cache",
```

- viewer/template.html

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
      import { App } from './template.tsx';

      document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('app');
        if (container) {
          const root = createRoot(container);
          root.render(<App />);
        }
      });
    </script>
  </body>
</html>
```

- viewer/template.tsx

```tsx
import { FC } from 'react';

export const App: FC<{}> = () => <div>OK</div>;
```

### Tailwind

```sh
yarn add -D tailwindcss postcss autoprefixer
yarn tailwindcss init -p
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
```

### Concurrent script

```sh
yarn add -D concurrently
```

```diff
-     "dev": "next dev",
+     "dev": "concurrently \"dev:editor\" \"dev:viewer\"",
+     "dev:editor": "next dev",
```
