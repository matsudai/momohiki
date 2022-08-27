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

