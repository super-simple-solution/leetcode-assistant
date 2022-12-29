const I18n = {
  en: {
    desc: 'Description',
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
    desc: '描述',
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

export const isZH = location.origin.includes('leetcode-cn')
const lang = isZH ? 'zh' : 'en'
export const langEnum = I18n[lang]
