import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from "path";

export default defineConfig({
  base: './',
  plugins: [vue()],
  // 配置本地代理
  server: {
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值, /api 是在 axios 实例中配置的
        target: 'http://47.99.134.126:7008',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "components": path.resolve(__dirname, "src/components"),
      "styles": path.resolve(__dirname, "src/styles"),
      "plugins": path.resolve(__dirname, "src/plugins"),
      "views": path.resolve(__dirname, "src/views"),
      "layouts": path.resolve(__dirname, "src/layouts"),
      "utils": path.resolve(__dirname, "src/utils"),
      "apis": path.resolve(__dirname, "src/apis"),
      "dirs": path.resolve(__dirname, "src/directives"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
  },
})
