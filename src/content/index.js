import { domMutation, getEle } from '@/utils'
import '@/style/leetcode.css'
import '@/style/desc.css'
import list from './batch'
const locationHref = window.location.href

// import devtools from '@vue/devtools'
// if (process.env.NODE_ENV === 'development') {
//   devtools.connect()
// }

const patterns = {
  list: {
    match: /problemset/,
    handler() {
      let listContainer = '[role="rowgroup"], .reactable-data'
      domMutation(getEle('.question-list-hr+div, [role="table"]'), () => list(listContainer))
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