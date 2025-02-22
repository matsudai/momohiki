import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { FC } from 'react'
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
  const { data } = useQuery<string>({
    queryKey: ['HomePage', 'response'],
    queryFn: async () => {
      return new Promise((r) => {
        setTimeout(() => { r(new Date().toLocaleString()) }, 1000)
      })
    }
  })

  return <div>
      <h1>Home</h1>
      <p>(&gt;<Link to="/sub">Sub</Link>)</p>
      <p>{data ?? 'request...'}</p>
    </div>
}

export default App
