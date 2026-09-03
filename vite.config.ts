import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/Poliocalculator/',

  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],

      manifest: {
        id: '/Poliocalculator/',
        name: 'Polio Campaign Calculator',
        short_name: 'PolioCalc',
        description:
          'Mobile-friendly field calculator for polio campaign workers, vaccinators, supervisors, and UC staff.',
        theme_color: '#0d9488',
        background_color: '#f8fafc',
        display: 'standalone',

        start_url: '/Poliocalculator/',
        scope: '/Poliocalculator/',

        icons: [
          {
            src: '/Poliocalculator/icon.svg',
            sizes: '512x512 192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },

      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
