import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'esbuild',
    rollupOptions: {
      // external: ['file-saver'],
    },

    lib: {
      entry: resolve(__dirname, 'init.js'),
      name: 'exportWordDocx',
      fileName: 'export-word-docx',
    },
  },
});
