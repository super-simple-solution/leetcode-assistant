import { createApp } from 'vue'
import App from './App.vue'
import '@/style/index.css'
import { getEle, getAttrs } from '@/utils'

export default function (dom) {
  let container = getEle(dom)
  let list = Array.from(container.children).map(item => ({
    dom: item.outerHTML,
    attrs: getAttrs(item),
    tag: item.tagName,
  }))

  console.log(list.length, 'list')
  const app = createApp({
    data() {
      return {
        list,
      }
    },
    ...App
  })
  if (!getEle(dom)) return
  app.mount(dom)
}