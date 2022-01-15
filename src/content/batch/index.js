import { createApp } from 'vue'
import App from './App.vue'
import '@/style/index.css'
import { getEle, getAttrs } from '@/utils'

export default function (dom) {
  let container = getEle(dom)
  if (!container) return
  let list = Array.from(container.children).map(item => {
    let link = getEle('.truncate a', item)
    return {
      dom: item.outerHTML,
      attrs: getAttrs(item),
      tag: item.tagName,
      data: {
        desc: '',
        descZH: '',
        solution: '',
        solutionList: [], // zh
      },
      info: {
        questionName: link.href.match(/problems\/([^?/]+)/)[1],
        questionFullName: link.textContent,
        questionFullNameZH: '',
        questionId: '',
        titleSlug: '',
      }
    }
  })

  const app = createApp({
    ...App,
    props: ['list'],
  }, {
    list: list,
  })
  if (!getEle(dom)) return
  app.mount(dom)
}