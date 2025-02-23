import { markdown } from '@codemirror/lang-markdown'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { basicSetup, EditorView } from 'codemirror'
import { FC, useEffect, useMemo, useState } from 'react'
import { HashRouter, Link, Route, Routes } from 'react-router'

const queryClient = new QueryClient()

const App: FC = () => {
  return <QueryClientProvider client={queryClient}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sub" element={<div>Sub(&gt;<Link to="/">Home</Link>)</div>} />
      </Routes>
    </HashRouter>
  </QueryClientProvider>
}

const HomePage: FC = () => {
  const [editor, setEditor] = useState<EditorView>()
  const { data } = useQuery<string>({
    queryKey: ['HomePage', 'response'],
    queryFn: async () => {
      return new Promise((r) => {
        setTimeout(() => { r(new Date().toLocaleString()) }, 1000)
      })
    }
  })

  useEffect(() => {
    const editorEl = document.getElementById('editor');
    let editor: EditorView | undefined = undefined;
    if (editorEl) {
      setEditor((e) => {
        if (e) { return e; }
        editor = new EditorView({
          parent: editorEl,
          doc: `*CodeMirror* Markdown \`mode\``,
          extensions: [basicSetup, markdown()]
        })
        return editor
      })
    }
    return () => { editor?.destroy() }
  }, [])

  return <div>
      <h1>Home</h1>
      <p>(&gt;<Link to="/sub">Sub</Link>)</p>
      <p>{data ?? 'request...'}</p>
      <hr />
      <div id="editor" />
    </div>
}

export default App
