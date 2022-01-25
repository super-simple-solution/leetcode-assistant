export function injectScript(file, node) {
  let th = document.getElementsByTagName(node)[0]
  let s = document.createElement('script')
  s.id = chrome.runtime.id
  s.setAttribute('type', 'text/javascript')
  s.setAttribute('src', file)
  th.appendChild(s)
}

export function injectScriptByUrl(url) {
  let s = document.createElement('script')
  s.id = chrome.runtime.id
  s.setAttribute('type', 'text/javascript')
  s.setAttribute('src', url)
  document.head.appendChild(s)
}

export function injectMunual() {
  injectScript(chrome.extension.getURL('/js/inject.js'), 'body')
}

export function injectCSS(file) {
  let head = document.head
  let s = document.createElement('link')
  s.id = chrome.runtime.id
  s.setAttribute('rel', 'stylesheet')
  s.setAttribute('type', 'text/css')
  s.setAttribute('href', file)
  head.appendChild(s)
}

export function initEventHandler(contentReq) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let rdata = request.data
    let tabId = sender.tab && sender.tab.id
    let handler = contentReq[request.greeting]
    if (handler) {
      handler(rdata, sendResponse, tabId)
    }
    return true
  })
}