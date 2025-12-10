import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'flag-icons/css/flag-icons.min.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/provider/theme-provider.tsx'
import { BrowserRouter } from 'react-router'

if (import.meta.env.DEV) {
  import('react-scan')
    .then(({ scan }) => {
      scan({
        enabled: true,
        log: true,
      })
    })
    .catch(() => {})
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
