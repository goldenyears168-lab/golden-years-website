import { useEffect } from "react";
import { useLocation, BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import CanonicalMeta from "@/components/base/CanonicalMeta";
import { ErrorBoundary } from "@/components/base/ErrorBoundary";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <ErrorBoundary>
        <CanonicalMeta />
        <ScrollToTop />
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;