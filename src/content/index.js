import { domMutation, getEle } from '@/utils'
import list from './batch'
const locationHref = window.location.href

const patterns = {
  list: {
    match: /problemset/,
    handler() {
      let listContainer = '[role="rowgroup"], .reactable-data'
      domMutation(getEle('.question-list-hr+div'), () => list(listContainer))
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