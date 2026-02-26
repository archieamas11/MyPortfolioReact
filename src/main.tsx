import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'flag-icons/css/flag-icons.min.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/provider/theme-provider.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import NotFound from '@/pages/NotFound.tsx'
import { MotionConfig as MotionConfigFromMotion } from 'motion/react'
import { MotionConfig as MotionConfigFromFramer } from 'framer-motion'

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
      <MotionConfigFromFramer reducedMotion="user">
        <MotionConfigFromMotion reducedMotion="user">
          <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </MotionConfigFromMotion>
      </MotionConfigFromFramer>
    </BrowserRouter>
  </StrictMode>,
)
