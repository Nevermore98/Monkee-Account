import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from "path";

export default defineConfig({
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
  // resolve: {
  //   alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  // },
})
