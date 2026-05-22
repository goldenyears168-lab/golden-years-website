/// <reference types="vite/client" />

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    REACT_APP_NAVIGATE?: (path: string) => void;
  }
}

export {};