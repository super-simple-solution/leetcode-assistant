import { getEle, createDom } from '@/utils'
import '@/style/leetcode.css'
import '@/style/desc.css'
import list from './batch'
const locationHref = window.location.href

// import devtools from '@vue/devtools'
// if (process.env.NODE_ENV === 'development') {
//   devtools.connect() 
// }

// injectScriptByUrl('http://localhost:8098')

let hiddenEl = createDom('span', '', 'hidden-el')
document.body.appendChild(hiddenEl)

const patterns = {
  list: {
    match: /problemset/,
    handler() {
      let listContainer = getEle('[role="rowgroup"]')
      list('.hidden-el')
      listContainer.addEventListener('click', (event) => {
        let target = event.target
        if (!target.classList.contains('solution-btn')) return
          let targetItem = target.closest('[role="row"]')
          let questionName = targetItem.querySelector('a').href.match(/problems\/([^?/]+)/)[1]
          let questionFullName = targetItem.querySelector('.truncate').textContent
          const questionEvent = new CustomEvent('click-question', {
            'detail':{
              questionName,
              questionFullName
            }
          })
          window.dispatchEvent(questionEvent)
      })
      let nodeList = Array.from(document.querySelectorAll('[role="rowgroup"]>[role="row"]'))
      nodeList.forEach(item => {
        let parentNode = item.children[2]
        parentNode.classList.add('solution-btn-parent')
        parentNode.appendChild(createDom('button', '获取题解', 'solution-btn'))
      })
    }
  },
  detail: {
    match: '',
    handler() {}
  },
}

function matchUrl() {
  for (let key in patterns) {
    let curPattern = patterns[key]
    if (locationHref.match(curPattern.match)) {
      curPattern.handler()
      break
    }
  }
}

setTimeout(matchUrl, 500)