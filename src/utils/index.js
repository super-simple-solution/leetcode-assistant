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

import katex from 'katex'
import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/default.css'

const regList = [
  {
    name: 'img',
    reg: new RegExp(/\(\.\.\/Figures\//g),
    to: () => `(/problems/${questionName}/Figures/`
  },
  {
    name: 'video',
    reg: /!\[[^\]\[]+\]\(([^)(]+\.mp4)\)/g,
    to: (_, p1) => `<video src="//problems/${questionName}${p1}" style="width: 100%" controls="" preload="none" poster="封面">
          <source id="mp4" src="mp4格式视频" type="video/mp4">
        </video>`
  },
  {
    name: 'katex',
    reg:  /\$+([^\$]+?)\$+/g,
    to: (_, p1) => {
      return katex.renderToString(p1, {
        throwOnError: false,
        displayMode: true,
        output: 'html'
      })
    }
  },
  {
    // '45\\xb0 diagonal' to '45° diagonal'
    name: 'hex to symbol',
    reg: /\\x(\S+)/gm,
    to: (_, p1) => String.fromCodePoint(parseInt(`00${p1}`, 16))
  },
  // {
  //   // markdown will not parse unicode to symbol in code element
  //   // TODO `45\xb0 diagonal` TO `45 ${unicode symbol} diagonal`
  //   name: 'code',
  //   reg: /`+([^`]+?)`+/g,
  //   to: () => hljs.highlight
  // },
  {
    name: 'newline',
    reg: /\\n/g,
    to:  '\n',
  }
]

export function parseContent(content, questionName) {
  regList.forEach(item => {
    content = content.replace(item.reg, item.to)
  })
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
