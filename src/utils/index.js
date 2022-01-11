export function getEle(el, context) {
  if (!el) return
  return (context || document).querySelector(el)
}

export function $$(el, context) {
  if (!el) return []
  return Array.from((context || document).querySelectorAll(el))
}

export function getAttrs(el) {
  let res = {}
  for (let key in el.attributes) {
    if (isNaN(+key)) {
      res[key] = el.attributes[key].value
    }
  }
  return res
}

import debounce from 'lodash.debounce'
export function domMutation(targetNode, cb) {
  let observer
  const cbFun = debounce(function() {
    cb()
  }, 1000)
  observer = new MutationObserver(cbFun)
  const config = { childList: true, subtree: true }
  observer.observe(targetNode, config)
}
