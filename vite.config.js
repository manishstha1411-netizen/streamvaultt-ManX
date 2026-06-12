import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'StreamVault',
        short_name: 'StreamVault',
        description: 'Your personal streaming hub for Movies, TV & Anime',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Cache the app shell so it opens even with a flaky connection.
        // API calls (stream/search) are always fetched fresh (network-only).
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/(8api|api)\/.*/,
            handler: 'NetworkOnly'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],

  server: {
    host: true, // bind to 0.0.0.0 so phones on the same Wi-Fi can connect
    proxy: {
      // Original 8Stream API
      '/8api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/8api/, ''),
      },
      // AnimeWorld India (Hindi Dub) — proxied through the same backend
      '/api/v1/awi': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    }
  }
})
