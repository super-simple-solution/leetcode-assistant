import Components from 'unplugin-vue-components/vite'
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
  output: {
    sourcemap: 'inline',
  },
  plugins: [
    Components({
      resolvers: [AntDesignVueResolver()],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
    vue(),
    chromeExtension(),
  ],
  configureWebpack: {
    devtool: "true",
  }
})