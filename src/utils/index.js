export function getEle(el, context) {
  return (context || document).querySelector(el)
}