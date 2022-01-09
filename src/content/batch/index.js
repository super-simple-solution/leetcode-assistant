import { createApp } from 'vue'
import App from './App.vue'
import '@/style/index.css'
import { getEle } from '@/utils'

const app = createApp(App)
export default function (dom) {
  if (!getEle(dom)) return
  app.mount(dom)
}