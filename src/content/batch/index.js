import App from './App.vue'
import '@/style/index.scss'
import '@/style/antv.css'
import { getEle } from '@/utils'

export default function (dom) {
  let container = getEle(dom)
  if (!container) return

  const app = createApp(App)
  if (!getEle(dom)) return
  app.mount(dom)
}
