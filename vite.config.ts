import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { reactGrab } from 'react-grab/plugins/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), reactGrab()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
