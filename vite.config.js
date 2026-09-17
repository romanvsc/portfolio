import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { generateTheme } from './scripts/generate-theme.mjs';

export default defineConfig({
  plugins: [tailwindcss(), {
    name: 'semantic-theme',
    async handleHotUpdate({ file }) {
      if (file.replaceAll('\\', '/').endsWith('/src/tokens.json')) await generateTheme();
    },
  }],
  server: {
    host: '127.0.0.1',
    port: 5178,
  },
  preview: {
    host: '127.0.0.1',
    port: 5178,
  },
});
