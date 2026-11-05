import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  // the plugin is served from a folder on GitHub Pages, so every path is relative
  base: './',
  // the build goes to public/, the folder the Pages workflow uploads
  publicDir: 'static',
  build: { outDir: 'public', emptyOutDir: true },
  test: { environment: 'jsdom', include: ['src/**/*.spec.ts'] },
});
