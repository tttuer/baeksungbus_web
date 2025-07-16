import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // 🟡 이거 중요!
    },
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: ['arc.baeksung.kr'], // ✅ 여기에 추가
  }, 
});