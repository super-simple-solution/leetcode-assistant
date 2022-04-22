import App from './App.vue'
import '@/style/index.scss'
import '@/style/antv.css'
import { getEle } from '@/utils'

export default function (el) {
  let container = getEle(el)
  if (!container) return

  const app = createApp(App)
  app.mount(el)
}
