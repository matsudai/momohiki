# MEMO

## Vite

* Create Vite app

    ```sh
    # https://ja.vite.dev/guide/
    npm create vite@latest

        # > npx
        # > create-vite
        #
        # ✔ Project name: … momohiki
        # ✔ Select a framework: › React
        # ✔ Select a variant: › TypeScript + SWC
        #
        # Scaffolding project in /home/matsudai/momohiki/momohiki...
        #
        # Done. Now run:
        #
        #   cd momohiki
        #   npm install
        #   npm run dev
    ```

## Tailwind

* Install

    ```sh
    # https://tailwindcss.com/docs/installation/using-vite
    npm install tailwindcss @tailwindcss/vite
    ```

* vite.config.ts

    ```diff
      import { defineConfig } from 'vite'
    + import tailwindcss from '@tailwindcss/vite'
      import react from '@vitejs/plugin-react-swc'

      // https://vite.dev/config/
      export default defineConfig({
    -   plugins: [react()],
    +   plugins: [react(), tailwindcss()],
      })
    ```

* src/index.css

    ```diff
    + @import "tailwindcss";
    - ...
    ```

* Delete src/App.css

## React icons

* Install

    ```sh
    npm install react-icons
    ```

## React router

* Install

    ```sh
    # https://reactrouter.com/start/library/installation
    npm i react-router
    ```

* src/App.tsx

    ```diff
      import { FC } from 'react'
    + import { HashRouter, Link, Route, Routes } from 'react-router'

      const App: FC = () => {
    +   return <HashRouter>
    +     <Routes>
    +       <Route path="/" element={<div>Home(&gt;<Link to="/sub">Sub</Link>)</div>} />
    +       <Route path="/sub" element={<div>Sub(&gt;<Link to="/">Home</Link>)</div>} />
    +     </Routes>
    +   </HashRouter>
      }

      export default App
    ```

## React query (TanStack Query)

* Install

    ```sh
    # https://tanstack.com/query/v5/docs/framework/react/installation
    npm i @tanstack/react-query
    ```

* src/App.tsx

    ```diff
    + import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
      import { FC } from 'react'
      import { HashRouter, Link, Route, Routes } from 'react-router'

    + const queryClient = new QueryClient()

      const App: FC = () => {
    -   return <HashRouter>
    +   return <QueryClientProvider client={queryClient}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sub" element={<div>Sub(&gt;<Link to="/">Home</Link>)</div>} />
            </Routes>
          </HashRouter>
    +   </QueryClientProvider>
      }
    ```

## CodeMirror & Markdown

* Install

    ```sh
    npm install codemirror @codemirror/lang-markdown
    ```
