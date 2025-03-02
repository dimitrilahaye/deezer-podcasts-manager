import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.svg', '**/*.png'],
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        theme_color: "#8936FF",
        background_color: "#000000",
        icons: [
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "icon512_maskable.png",
            type: "image/png",
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: "icon512_rounded.png",
            type: "image/png",
          },
        ],
        orientation: "portrait",
        display: "standalone",
        dir: "ltr",
        lang: "fr",
        name: "Deezer Podcast Manager",
        short_name: "dpm",
        description: "Gérer ses podcasts Deezer tout seul",
        id: "deezer-podcasts-manager",
      },
    }),
  ],
});
