import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});