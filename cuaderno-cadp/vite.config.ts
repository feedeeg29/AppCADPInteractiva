import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En GitHub Pages el sitio vive en una subcarpeta (/AppCADPInteractiva/).
// El workflow de GitHub define BASE_PATH; en local y en Vercel queda "/".
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  // La guía de ejercicios es mucho texto: el bundle pesa ~580 kB (~165 kB con gzip).
  build: { chunkSizeWarningLimit: 800 },
});
