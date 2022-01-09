import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components'
import {
  resolve
} from "path"
import {
  defineConfig
} from "vite"
import {
  chromeExtension
} from "vite-plugin-chrome-extension"
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: "src/manifest.json",
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