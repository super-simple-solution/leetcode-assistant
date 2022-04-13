import { abbreviateNumber } from '@/utils'
import { langEnum } from './const'
import apiMap from '@/api'

export function initData() {
  return {
    activeKey: langEnum.tab1.key,
    data: {
      desc: '',
      descZH: '',
      enSolution: '',
      enSolutionGeted: false,
      zhDiscussList: [], // zh
      enDiscussList: [], // zh
      totalNum: 0,
      pageNum: 1,
    },
    info: {
      questionName: '',
      questionFullName: '',
      questionFullNameZH: '',
      questionId: '',
      titleSlug: '',
    },
    tag: {
      enList: [],
      zhList: [],
    },
  }
}

export function getEnDiscussList(options) {
  apiMap.enDiscussList(options).then((res) => {
    const { totalNum, edges = [] } = res.questionTopicsList
    const discussList = edges.map((item) => ({
      ...item.node,
      resove: '',
      voteCountText: abbreviateNumber(item.node.post.voteCount),
      viewCountText: abbreviateNumber(item.node.viewCount),
      title_format: item.node.title.replace(/\s/g, '-'),
    }))
    return {
      discussList,
      totalNum,
    }
  })
}

export function getZhDiscussList(options) {
  apiMap.zhDiscussList(options).then((res) => {
    const { totalNum, edges = [] } = res.questionSolutionArticles
    const discussList = edges.map((item) => {
      let count = (item.node.reactionsV2 || []).map((_v) => _v.count).reduce((cur, prev) => cur + prev, 0)
      return {
        ...item.node,
        key: item.node.slug,
        resolve: '',
        desc: item.node.summary.slice(0, 40),
        voteCountText: abbreviateNumber(count),
        viewCountText: abbreviateNumber(item.node.hitCount),
      }
    })
    return {
      discussList,
      totalNum,
    }
  })
}
