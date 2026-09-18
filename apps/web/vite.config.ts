import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  optimizeDeps: {
    // packages/shared-types va business-rules la workspace packages bien dich sang
    // CommonJS (de tuong thich voi build CommonJS cua apps/api). Vite dev-serve goi
    // workspace-linked truc tiep qua /@fs/ (khong qua buoc optimize deps mac dinh),
    // nen phai include tuong minh de esbuild chuyen doi CJS -> ESM dung cach,
    // neu khong trinh duyet se bao "does not provide an export named ...".
    include: ['@rmc-ms/shared-types', '@rmc-ms/business-rules'],
  },
})
