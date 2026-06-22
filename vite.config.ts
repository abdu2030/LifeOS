import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: projectRoot,
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons.svg',
        'pwa/icon-192.png',
        'pwa/icon-512.png',
        'pwa/screenshot-mobile.png',
        'pwa/screenshot-wide.png',
      ],
      manifest: {
        background_color: '#080b12',
        categories: ['productivity', 'finance', 'lifestyle'],
        description: 'A privacy-first personal operating system dashboard.',
        display: 'standalone',
        id: '/',
        name: 'LifeOS',
        orientation: 'portrait-primary',
        scope: '/',
        short_name: 'LifeOS',
        start_url: '/',
        theme_color: '#080b12',
        icons: [
          {
            purpose: 'any',
            sizes: '192x192',
            src: '/pwa/icon-192.png',
            type: 'image/png',
          },
          {
            purpose: 'any maskable',
            sizes: '512x512',
            src: '/pwa/icon-512.png',
            type: 'image/png',
          },
          {
            purpose: 'any',
            sizes: 'any',
            src: '/favicon.svg',
            type: 'image/svg+xml',
          },
        ],
        screenshots: [
          {
            form_factor: 'wide',
            label: 'LifeOS desktop dashboard with widgets and offline sync',
            sizes: '1280x720',
            src: '/pwa/screenshot-wide.png',
            type: 'image/png',
          },
          {
            label: 'LifeOS mobile dashboard with personal modules',
            sizes: '390x844',
            src: '/pwa/screenshot-mobile.png',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            handler: 'NetworkFirst',
            options: {
              cacheName: 'lifeos-supabase-api',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24,
                maxEntries: 80,
              },
              networkTimeoutSeconds: 6,
            },
            urlPattern: ({ url }) => url.hostname.endsWith('supabase.co') && url.pathname.includes('/rest/v1/'),
          },
          {
            handler: 'NetworkFirst',
            options: {
              cacheName: 'lifeos-edge-functions',
              expiration: {
                maxAgeSeconds: 60 * 30,
                maxEntries: 30,
              },
              networkTimeoutSeconds: 8,
            },
            urlPattern: ({ url }) => url.hostname.endsWith('supabase.co') && url.pathname.includes('/functions/v1/'),
          },
          {
            handler: 'CacheFirst',
            options: {
              cacheName: 'lifeos-static-assets',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 30,
                maxEntries: 100,
              },
            },
            urlPattern: ({ request }) =>
              ['font', 'image', 'script', 'style'].includes(request.destination),
          },
          {
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'lifeos-pages',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 7,
                maxEntries: 40,
              },
            },
            urlPattern: ({ request }) => request.mode === 'navigate',
          },
        ],
      },
    }),
  ],
})
