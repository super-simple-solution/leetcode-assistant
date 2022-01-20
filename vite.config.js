import ViteComponents from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { chromeExtension } from 'rollup-plugin-chrome-extension'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    vue(),
    chromeExtension(),
    ViteComponents({
      resolvers: [AntDesignVueResolver()]
    })
  ],
  configureWebpack: {
    devtool: "true",
  }
})