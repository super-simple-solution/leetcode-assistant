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

export function domMutation(targetNode, cb) {
  const cbFun = debounce(function () {
    cb(...arguments)
    observer.disconnect()
  }, 200)
  const observer = new MutationObserver(cbFun)
  const config = { childList: true }
  observer.observe(targetNode, config)
}

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce
function debounce(func, wait, immediate) {
  let timeout
  return () => {
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!immediate) func.apply(this, args)
    }, wait)
    if (immediate && !timeout) func.apply(this, args)
  }
}
