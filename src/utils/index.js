export function getEle(el, context) {
  if (!el) return
  return (context || document).querySelector(el)
}

export function $$(el, context) {
  if (!el) return []
  return Array.from((context || document).querySelectorAll(el))
}

export function getAttrs(el) {
  const res = {}
  for (const key in el.attributes) {
    if (isNaN(+key)) {
      res[key] = el.attributes[key].value
    }
  }
  return res
}

const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']
export function abbreviateNumber(number) {
  const tier = (Math.log10(number) / 3) | 0
  // if zero, we don't need a suffix
  if (tier == 0) return number

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier]
  const scale = Math.pow(10, tier * 3)

  // scale the number
  const scaled = number / scale

  // format number and add suffix
  return scaled.toFixed(1) + suffix
}

export function createEle(option) {
  const { tag, content, class: className } = option
  const el = document.createElement(tag)
  el.innerText = content || ''
  el.className = className
  return el
}

export function observeContainer({ selector, callback, root = 'body' }) {
  const loadMoreObserver = new MutationObserver(callback)

  function mutationInitCallback() {
    const container = getEle(selector)
    if (!container) {
      return
    }
    loadMoreObserver.disconnect()
    loadMoreObserver.observe(container, { childList: true })
  }

  const rootEle = getEle(root)
  const rootObserver = new MutationObserver(mutationInitCallback)
  rootObserver.observe(rootEle, { subtree: true, childList: true })
}
