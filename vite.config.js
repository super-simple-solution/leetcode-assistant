import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components'
import {
  resolve
} from "path"
import {
  defineConfig
} from "vite"
import vue from '@vitejs/plugin-vue'
import { chromeExtension } from 'rollup-plugin-chrome-extension'

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    chromeExtension(),
    ViteComponents({
      customComponentResolvers: [AntDesignVueResolver()],
    })
  ],
})