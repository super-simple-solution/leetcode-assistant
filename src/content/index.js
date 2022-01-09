import list from './batch'

const locationHref = window.location.href

const patterns = {
  list: {
    match: /problemset/,
    handler() {
      setTimeout(() => {
        let listContainer = '[role="rowgroup"], .reactable-data'
        list(listContainer)
      }, 3000)
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

matchUrl()