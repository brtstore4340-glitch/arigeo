import { Navigate, Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { QueryClientProvider } from '@tanstack/react-query'
import Layout from '@/components/Layout'
import ScrollToTop from '@/components/ScrollToTop'
import PageNotFound from '@/lib/PageNotFound'
import Home from '@/pages/Home'
import { queryClientInstance } from '@/lib/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route element={<Layout />}>
            <Route path="/:locale" element={<Home />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
