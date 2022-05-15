yarn create next-app momohiki --typescript

```diff
      "build": "next build",
+     "export": "next build && next export",
      "start": "next start",
```

```txt
mkdir src
mv pages src/
mv styles src/
```

```txt
mkdir -p src/lib/parser
mkdir -p src/lib/renderer
```

yarn add @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^6 @chakra-ui/icons react-icons
yarn add unified remark-parse remark-gfm remark-rehype rehype-highlight rehype-react highlight.js

```txt
mkdir -p src/static
```

yarn add -D parcel @parcel/config-default @parcel/transformer-typescript-tsc @parcel/validator-typescript
yarn add -D process


yarn add -D concurrently

### Markdown Editor

* ※ UNOFFICIAL

```sh
yarn add @monaco-editor/react monaco-editor
yarn add -D copy-webpack-plugin
```
