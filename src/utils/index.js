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
    if (+key !== key) {
      res[key] = el.attributes[key].value
    }
  }
  return res
}