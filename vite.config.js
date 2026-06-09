import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      injectRegister: "auto", // Ensures the script is actually added to your HTML
      workbox: {
        globPatterns: ["*/.{js,css,html,ico,png,svg}"], // Caches your assets for offline use
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst", // Helps icons and logos load offline
          },
        ],
      },
      manifest: {
        name: "Efootball Center",
        short_name: "EC",
        description:
          "A unified platform for eFootball players to track their stats, compare with friends, and find teams.",
        theme_color: "#ffffff",
        background_color: "#000000",
        display: "standalone",
        
        // ==========================================
        // REQUIRED ROUTING FIXES FOR IN-APP BROWSERS
        // ==========================================
        start_url: "/",
        scope: "/",
        launch_handler: {
          client_mode: ["focus-existing", "auto"]
        },
        // ==========================================

        // PWABuilder Fix: Add a unique ID and orientation
        id: "/?source=pwa",
        orientation: "portrait",
        icons: [
          {
            src: "Ec-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "Ec-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "Ec-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshot.png", 
            sizes: "1080x1920",
            type: "image/png",
            label: "Tournament Leaderboard",
          },
          {
            src: "screenshot-wide.png",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide",
            label: "eFootball Center Desktop",
          },
        ],
        categories: ["games", "sports"],
      },
    }),
  ],
  server: {
    host: true,
  },
});