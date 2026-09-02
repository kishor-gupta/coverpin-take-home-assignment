import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      const index = resolve('dist/index.html')
      if (existsSync(index)) {
        copyFileSync(index, resolve('dist/404.html'))
      }
    },
  }
}

export default defineConfig({
  base: '/coverpin-take-home-assignment/',
  plugins: [react(), tailwindcss(), githubPagesSpaFallback()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['node_modules/**', 'dist/**', '.appendix-a/**'],
  },
})
