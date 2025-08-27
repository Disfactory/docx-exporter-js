import { defineConfig } from 'vite';

// Use BASE_PATH from configure-pages, fallback to repo path when running in Actions,
// otherwise '/' for local dev
const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
const ghBase = repoName ? `/${repoName}/` : '/';
const base = process.env.BASE_PATH ?? ghBase;

export default defineConfig({
  base,
  build: {
    outDir: 'dist-site',
    minify: 'esbuild',
  },
});
