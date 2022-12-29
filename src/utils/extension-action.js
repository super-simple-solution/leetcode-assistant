export function injectScript(file, node) {
  const th = document.getElementsByTagName(node)[0]
  const s = document.createElement('script')
  s.id = chrome.runtime.id
  s.setAttribute('type', 'text/javascript')
  s.setAttribute('src', file)
  th.appendChild(s)
}

export function injectScriptByUrl(url) {
  const s = document.createElement('script')
  s.id = chrome.runtime.id
  s.setAttribute('type', 'text/javascript')
  s.setAttribute('src', url)
  document.head.appendChild(s)
}

export function injectMunual() {
  injectScript(chrome.extension.getURL('/js/inject.js'), 'body')
}

export function injectCSS(file) {
  const head = document.head
  const s = document.createElement('link')
  s.id = chrome.runtime.id
  s.setAttribute('rel', 'stylesheet')
  s.setAttribute('type', 'text/css')
  s.setAttribute('href', file)
  head.appendChild(s)
}

export function initEventHandler(contentReq) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const rdata = request.data
    const tabId = sender.tab && sender.tab.id
    const handler = contentReq[request.greeting]
    if (handler) {
      handler(rdata, sendResponse, tabId)
    }
    return true
  })
}
