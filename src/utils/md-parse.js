import katex from 'katex'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (e) {
        console.log(e)
      }
    } else {
      return hljs.highlightAuto(str).value
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    // return ''; // use external default escaping
  },
})

function geneRegList(questionName) {
  return [
    {
      name: 'img',
      reg: new RegExp(/\(\.\.\/Figures\//g),
      to: () => `(/problems/${questionName}/Figures/`,
    },
    {
      name: 'video',
      reg: /!\[[^\][]+\]\(([^)(]+\.mp4)\)/g,
      to: (
        _,
        p1,
      ) => `<video src="//problems/${questionName}${p1}" style="width: 100%" controls="" preload="none" poster="封面">
          <source id="mp4" src="mp4格式视频" type="video/mp4">
        </video>`,
    },
    {
      // '45\\xb0 diagonal' to '45° diagonal'
      name: 'hex to symbol',
      reg: /\\x(\S+)/gm,
      to: (_, p1) => String.fromCodePoint(parseInt(`00${p1}`, 16)),
    },
    {
      name: 'newline',
      reg: /\\n/g,
      to: '\n',
    },
    {
      name: 'tab',
      reg: /\\t/g,
      to: '  ',
    },
  ]
}

export default function (content, questionName) {
  const regList = geneRegList(questionName)
  regList.forEach((item) => {
    content = content.replace(item.reg, item.to)
  })
  // get lang
  // let tabReg = /(\w+?)\s+\[sol\d+\-(.+?)\]/gm
  // let matchRes = content.match(tabReg)
  content = md.render(content)

  const katexReg = /\$+([^$]+?)\$+/g

  content = content.replace(katexReg, (_, p1) => {
    return katex.renderToString(p1, {
      throwOnError: false,
      displayMode: true,
      output: 'html',
    })
  })

  return content
}
