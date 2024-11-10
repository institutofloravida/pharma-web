import { QueryClientProvider } from '@tanstack/react-query'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { ThemeProvider } from './components/theme/theme-provider'
import { Toast } from './components/ui/toast'
import { Toaster } from './components/ui/toaster'
import { queryClient } from './lib/react-query'
import { router } from './routes'

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="pharma-theme" defaultTheme="dark">
        <Helmet titleTemplate="%s | pharma.web" />
        {/* <Toaster richColors closeButton position="top-right" /> */}
        <Toaster />
        <RouterProvider router={router} />
      </ThemeProvider>
    </HelmetProvider>
  )
}
