import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { chromeExtension } from 'rollup-plugin-chrome-extension'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import eslintPlugin from 'vite-plugin-eslint'
import manifest from './manifest.json'

// https://juejin.cn/post/7012446423367024676#heading-12

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  output: {
    sourcemap: 'inline',
  },
  build: {
    rollupOptions: {
      input: './manifest.json',
    },
  },
  plugins: [
    // visualizer(),
    vue(),
    chromeExtension({ manifest }),
    Components({
      resolvers: [AntDesignVueResolver()],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/],
    }),
    eslintPlugin(),
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // global imports to register
      imports: [
        // presets
        'vue',
      ],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      resolvers: [() => null],
    }),
  ],
})
