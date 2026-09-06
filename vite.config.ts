import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build' || mode === 'production' || process.env.NODE_ENV === 'production';

  return {
    base: isProduction ? '/Poliocalculator/' : '/',

  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        },
      },
    },
  },

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
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
};
});
