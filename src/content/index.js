import { getEle, createEle } from '@/utils'
import { langEnum } from './batch/const'
import '@/style/desc.css'
import '@/style/hljs.css'
import list from './batch'
const locationHref = window.location.href

// unvisible element to mount on
let hiddenEl = createEle({
  tag: 'span',
  class: 'hidden-el',
})
document.body.appendChild(hiddenEl)

const patterns = {
  list: {
    match: /(problemset|problem-list)/,
    handler() {
      let selector = '[role="rowgroup"], section table tbody'
      let listContainer = getEle(selector)
      // window.addHistoryListener('history', function () {
      listContainer = getEle(selector)
      // domMutation(listContainer, () => {
      console.log('dom change')
      let nodeList = Array.from(document.querySelectorAll('[role="rowgroup"]>[role="row"],  section table tbody tr'))
      nodeList.forEach((item) => {
        let parentNode = item.children[3]
        parentNode.classList.add('solution-btn-parent')
        parentNode.appendChild(
          createEle({
            tag: 'button',
            content: langEnum.init,
            class: 'solution-btn',
          }),
        )
      })
      // })
      // })
      list('.hidden-el')
      listContainer.addEventListener('click', (event) => {
        let target = event.target
        if (!target.classList.contains('solution-btn')) return
        let targetItem = target.closest('[role="row"], tbody>tr')
        let questionName = targetItem.querySelector('a').href.match(/problems\/([^?/]+)/)[1]
        let questionFullName = targetItem.querySelector('.truncate, td:nth-child(2)').textContent
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
    handler() {},
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
  for (let key in patterns) {
    let curPattern = patterns[key]
    if (locationHref.match(curPattern.match)) {
      curPattern.handler()
      break
    }
  }
}

setTimeout(matchUrl, 3000)
