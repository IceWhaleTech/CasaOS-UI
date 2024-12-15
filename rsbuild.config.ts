import path from 'node:path'
import process from 'node:process'
import { defineConfig } from '@rsbuild/core'
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginVue2 } from '@rsbuild/plugin-vue2'

export default defineConfig({
  plugins: [
    pluginVue2(),
    pluginNodePolyfill(),
    pluginSass(),
  ],
  source: {
    // 指定入口文件
    entry: {
      index: './src/main.js',
    },
  },
  html: {
    template: './public/index.html',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/v1': {
        target: `http://${process.env.VUE_APP_DEV_IP}:${process.env.VUE_APP_DEV_PORT}`,
        changeOrigin: true,
      },
      '/v2': {
        target: `http://${process.env.VUE_APP_DEV_IP}:${process.env.VUE_APP_DEV_PORT}`,
        changeOrigin: true,
      },
    },
  },

})
