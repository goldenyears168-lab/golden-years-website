import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import AutoImport from "unplugin-auto-import/vite";

const base = process.env.BASE_PATH || "/";

function asyncCssPlugin() {
  return {
    name: "async-css",
    transformIndexHtml(html: string) {
      // Protect existing <noscript> blocks from being double-processed
      const noscriptBlocks: string[] = [];
      const withPlaceholders = html.replace(/<noscript>[\s\S]*?<\/noscript>/gi, (match) => {
        noscriptBlocks.push(match);
        return `<!--__NOSCRIPT_${noscriptBlocks.length - 1}__-->`;
      });

      const transformed = withPlaceholders.replace(
        /<link rel="stylesheet"([^>]*)>/g,
        '<link rel="stylesheet"$1 media="print" onload="this.media=\'all\'" /><noscript><link rel="stylesheet"$1 /></noscript>'
      );

      return transformed.replace(
        /<!--__NOSCRIPT_(\d+)__-->/g,
        (_: string, i: string) => noscriptBlocks[parseInt(i)]
      );
    },
  };
}

export default defineConfig({
  define: {
    __BASE_PATH__: JSON.stringify(base),
  },
  plugins: [
    react(),
    AutoImport({
      imports: [
        {
          react: [
            ["default", "React"],
            "useState",
            "useEffect",
            "useContext",
            "useReducer",
            "useCallback",
            "useMemo",
            "useRef",
            "useImperativeHandle",
            "useLayoutEffect",
            "useDebugValue",
            "useDeferredValue",
            "useId",
            "useInsertionEffect",
            "useSyncExternalStore",
            "useTransition",
            "startTransition",
            "lazy",
            "memo",
            "forwardRef",
            "createContext",
            "createElement",
            "cloneElement",
            "isValidElement",
          ],
        },
        {
          "react-router-dom": [
            "useNavigate",
            "useLocation",
            "useParams",
            "useSearchParams",
            "Link",
            "NavLink",
            "Navigate",
            "Outlet",
          ],
        },
      ],
      dts: true,
    }),
    asyncCssPlugin(),
  ],
  base,
  build: {
    sourcemap: false,
    outDir: "out",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router-dom")
          ) {
            return "vendor";
          }
          return null;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name ?? "";
          if (/\.(woff2?|ttf|otf|eot)$/.test(info)) {
            return "assets/fonts/[name]-[hash][extname]";
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(info)) {
            return "assets/images/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
    chunkSizeWarningLimit: 700,
    cssCodeSplit: true,
    cssMinify: true,
    target: "es2020",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});