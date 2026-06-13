import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true, // Если порт занят, Vite не будет прыгать на другой, а честно скажет об этом
  }
})
