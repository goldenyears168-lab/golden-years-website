import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register Service Worker (manual — avoids touching index.html)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = `${__BASE_PATH__}sw.js`.replace(/\/+/g, '/')
    navigator.serviceWorker.register(swPath)
      .catch(() => {
        // SW registration failure is non-critical; silently ignore
      })
  })
}
