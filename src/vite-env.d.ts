/// <reference types="vite/client" />

import type { NavigateFunction } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    REACT_APP_NAVIGATE?: NavigateFunction;
  }
}

export {};