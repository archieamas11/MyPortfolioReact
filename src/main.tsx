import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "flag-icons/css/flag-icons.min.css";
import { MotionConfig as MotionConfigFromFramer } from "framer-motion";
import { MotionConfig as MotionConfigFromMotion } from "motion/react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "@/components/provider/theme-provider.tsx";
import NotFound from "@/pages/not-found.tsx";
import App from "./app.tsx";

const ignoreReactScanError = (): void => {
  // react-scan is optional in development.
};

if (import.meta.env.DEV) {
  import("react-scan")
    .then(({ scan }) => {
      scan({
        enabled: true,
        log: true,
      });
    })
    .catch(ignoreReactScanError);
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <MotionConfigFromFramer reducedMotion="user">
        <MotionConfigFromMotion reducedMotion="user">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="vite-ui-theme"
          >
            <Routes>
              <Route element={<App />} path="/" />
              <Route element={<NotFound />} path="*" />
            </Routes>
          </ThemeProvider>
        </MotionConfigFromMotion>
      </MotionConfigFromFramer>
    </BrowserRouter>
  </StrictMode>
);
