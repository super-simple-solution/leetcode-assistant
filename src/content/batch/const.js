const I18n = {
  en: {
    init: 'Description',
    discuss: 'Get Discuss',
    tab1: {
      tab: 'Discuss',
      key: 'discuss',
    },
    tab2: {
      tab: 'Solution',
      key: 'solution',
    },
    originalLink: 'Original Link',
  },
  zh: {
    init: '描述',
    discuss: '获取讨论',
    originalLink: '查看原文',
    tab1: {
      tab: '',
      key: '',
    },
    tab2: {
      tab: '',
      key: '',
    },
  },
}

let isZH = location.origin.includes('leetcode-cn')
let lang = isZH ? 'zh' : 'en'
export const langEnum = I18n[lang]
