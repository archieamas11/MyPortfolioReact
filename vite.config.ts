import { execSync } from "node:child_process";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { reactGrab } from "react-grab/plugins/vite";
import { defineConfig } from "vite";
import removeConsole from "vite-plugin-remove-console";

const getLastCommitDate = () => {
  try {
    const timestamp = execSync('git log -1 --format=%cd --date=format:"%B %Y"')
      .toString()
      .trim()
      .replace(/"/g, "");
    return timestamp;
  } catch {
    return "December 2025";
  }
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), reactGrab(), removeConsole()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  define: {
    __LAST_UPDATED__: JSON.stringify(getLastCommitDate()),
  },
});
