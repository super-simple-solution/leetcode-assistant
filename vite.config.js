import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components'
import {
  resolve
} from "path"
import {
  defineConfig
} from "vite"
import vue from '@vitejs/plugin-vue'
import { chromeExtension } from "vite-plugin-chrome-extension"

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2015",
    rollupOptions: {
      input: "src/manifest.json"
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