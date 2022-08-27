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
+ experimental: {
+   images: {
+     unoptimized: true
+   }
+ }
```
