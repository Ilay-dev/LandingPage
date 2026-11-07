import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base path ensures assets work on both root domains (ilay-dev.github.io)
  // and project subpaths (ilay-dev.github.io/LandingPage/) on GitHub Pages.
  base: './',
});

