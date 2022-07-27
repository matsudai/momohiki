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
