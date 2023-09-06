import { getEle, createEle, observeContainer } from '@/utils'
import { langEnum } from './list/const'
import '@/style/desc.css'
import '@/style/hljs.css'
import list from './list'
const locationHref = window.location.href

// unvisible element to mount on
const hiddenEl = createEle({
  tag: 'span',
  class: 'hidden-el',
})
document.body.appendChild(hiddenEl)

const patterns = {
  list: {
    match: /(problemset|problem-list)/,
    handler() {
      const selector = '[role="rowgroup"], section table tbody'
      observeContainer({
        selector,
        callback: () => {
          const listContainer = getEle(selector)
          console.log('dom change')
          const targetList = Array.from(
            document.querySelectorAll('[role="rowgroup"]>[role="row"],  section table tbody tr'),
          )
          targetList.forEach((item) => {
            const parentNode = item.children[3]
            parentNode.classList.add('solution-btn-parent')
            parentNode.appendChild(
              createEle({
                tag: 'button',
                content: langEnum.desc,
                class: 'solution-btn',
              }),
            )
          })

          listContainer.addEventListener('click', (event) => {
            const target = event.target
            if (!target.classList.contains('solution-btn')) return
            const targetItem = target.closest('[role="row"], tbody>tr')
            const questionName = targetItem.querySelector('a').href.match(/problems\/([^?/]+)/)[1]
            const questionFullName = targetItem.querySelector('.truncate, td:nth-child(2)').textContent
            const questionEvent = new CustomEvent('click-question', {
              detail: {
                questionName,
                questionFullName,
              },
            })
            window.dispatchEvent(questionEvent)
          })
        },
      })
      list('.hidden-el')
    },
  },
  detail: {
    match: '',
    handler() {
      console.log('detail page')
    },
  },
}

function matchUrl() {
  for (const key in patterns) {
    const curPattern = patterns[key]
    if (locationHref.match(curPattern.match)) {
      curPattern.handler()
      break
    }
  }
}

setTimeout(matchUrl, 3000)
