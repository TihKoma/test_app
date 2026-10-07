import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { checker } from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), 'REACT');

  return {
    envPrefix: ['REACT', 'VITE'],
    plugins: [
      react(),
      tsconfigPaths(),
      svgr(),
      checker({
        overlay: { initialIsOpen: false, position: 'br' },
        terminal: true,
        typescript: true,
        stylelint: {
          lintCommand: 'stylelint "src/**/*.{css,scss}"',
        },
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "src/**/*.{ts,tsx}"',
        },
        enableBuild: false,
      }),
    ],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3005',
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: 'localhost',
        },
        '/socket.io': {
          target: 'http://localhost:3005',
          changeOrigin: true,
          ws: true,
          secure: false,
          cookieDomainRewrite: 'localhost',
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@static': path.resolve(__dirname, './src/static'),
      },
    },
  };
});
