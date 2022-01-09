console.log('--')
import { vueInit } from './batch'

function injectMunual() {
  injectScript(chrome.extension.getURL('/js/inject.js'), 'body')
}

const locationHref = window.location.href

const patterns = {
  list: {
    match: /problemset/,
    handler() {
      vueInit('[role="rowgroup"]')
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