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

const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']
export function abbreviateNumber(number) {
  var tier = (Math.log10(number) / 3) | 0
  // if zero, we don't need a suffix
  if (tier == 0) return number

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier]
  var scale = Math.pow(10, tier * 3)

  // scale the number
  var scaled = number / scale

  // format number and add suffix
  return scaled.toFixed(1) + suffix
}

export function createEle(option) {
  const { tag, content, class: className } = option
  let el = document.createElement(tag)
  el.innerText = content || ''
  el.className = className
  return el
}

export function domMutation(targetNode, cb) {
  let observer
  const cbFun = debounce(function () {
    cb()
    observer.disconnect()
  }, 200)
  observer = new MutationObserver(cbFun)
  const config = { childList: true, subtree: true }
  observer.observe(targetNode, config)
}

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce
function debounce(func, wait, immediate) {
  let timeout
  return function () {
    let context = this,
      args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)
    if (immediate && !timeout) func.apply(context, args)
  }
}
