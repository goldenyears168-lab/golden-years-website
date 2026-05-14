import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import CanonicalMeta from "@/components/base/CanonicalMeta";

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
      <CanonicalMeta />
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;