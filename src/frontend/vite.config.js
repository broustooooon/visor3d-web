import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './', // Asegura que el index.html esté en el contexto actual
  publicDir: 'public', // Carpeta donde está el index.html
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
