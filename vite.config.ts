import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { reactGrab } from 'react-grab/plugins/vite'
import { execSync } from 'child_process'

// Get last git commit date
const getLastCommitDate = () => {
  try {
    const timestamp = execSync('git log -1 --format=%cd --date=format:"%B %Y"')
      .toString()
      .trim()
      .replace(/"/g, '')
    return timestamp
  } catch {
    return 'December 2025' // Fallback if git is not available
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), reactGrab()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __LAST_UPDATED__: JSON.stringify(getLastCommitDate()),
  },
})
