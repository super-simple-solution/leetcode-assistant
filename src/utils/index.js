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
    observer.disconnect()
  }, 200)
  observer = new MutationObserver(cbFun)
  const config = { childList: true, subtree: true }
  observer.observe(targetNode, config)
}

const imgReg = new RegExp(/\(\.\.\/Figures\//g)
const videoReg = /!\[[^\]\[]+\]\(([^)(]+\.mp4)\)/
export function parseContent(content, questionName) {
  if (content.match(imgReg)) {
    content = content.replace(imgReg, `(/problems/${questionName}/Figures/`)
  }
  if (content.match(videoReg)) {
    content = content.replace(
      videoReg
      `<video src="//problems/${questionName}${description.match(videoReg)[1]}" style="width: 100%" controls="" preload="none" poster="封面">
            <source id="mp4" src="mp4格式视频" type="video/mp4">
      </video>`
    )
  }
  return content
}



const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']
export function abbreviateNumber(number){
    var tier = Math.log10(number) / 3 | 0
    // if zero, we don't need a suffix
    if(tier == 0) return number

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier]
    var scale = Math.pow(10, tier * 3)

    // scale the number
    var scaled = number / scale

    // format number and add suffix
    return scaled.toFixed(1) + suffix
}
