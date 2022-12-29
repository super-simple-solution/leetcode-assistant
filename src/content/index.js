import { getEle, createEle } from '@/utils'
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
      let listContainer = getEle(selector)
      // window.addHistoryListener('history', function () {
      listContainer = getEle(selector)
      // domMutation(listContainer, () => {
      console.log('dom change')
      const nodeList = Array.from(document.querySelectorAll('[role="rowgroup"]>[role="row"],  section table tbody tr'))
      nodeList.forEach((item) => {
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
      // })
      // })
      list('.hidden-el')
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
      // insertEl()
    },
  },
  detail: {
    match: '',
    handler() {
      console.log('detail page')
    },
  },
}

// function insertEl() {
//   let nodeList = Array.from(document.querySelectorAll('[role="rowgroup"]>[role="row"],  section table tbody tr'))
//   nodeList.forEach((item) => {
//     let parentNode = item.children[3]
//     parentNode.classList.add('solution-btn-parent')
//     parentNode.appendChild(
//       createEle({
//         tag: 'button',
//         content: langEnum.init,
//         class: 'solution-btn',
//       }),
//     )
//   })
// }

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
