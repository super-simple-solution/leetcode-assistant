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

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      input: "src/manifest.json"
    }
  },
  plugins: [
    chromeExtension(),
    ViteComponents({
      customComponentResolvers: [AntDesignVueResolver()],
    })
  ],
})