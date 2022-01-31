<template>
  <a-drawer v-model:visible="descVisible" placement="bottom" :closable="false" height="600" @close="reset">
    <template #title>
      <a-row :gutter="10">
        <a-col :span="12">
          <span class="question-name">{{ curQuestionName }}</span>
        </a-col>
        <a-col :span="12">
          <a-tabs v-if="!isZH" v-model:activeKey="metaData.activeKey" @change="handleTabChange">
            <a-tab-pane :key="langObj.tab1.key" :tab="langObj.tab1.tab"></a-tab-pane>
            <a-tab-pane :key="langObj.tab2.key" :tab="langObj.tab2.tab"></a-tab-pane>
          </a-tabs>
          <a-button v-else type="primary" size="small" class="mt-10" @click="showSolution">{{
            langObj.discuss
          }}</a-button>
        </a-col>
      </a-row>
    </template>
    <a-row :gutter="10">
      <a-col :span="12">
        <div v-html="curDesc"></div>
      </a-col>
      <a-col :span="12">
        <a-spin :spinning="spinning">
          <!-- en -->
          <template v-if="!isZH">
            <template v-if="metaData.activeKey == langObj.tab2.key">
              <template v-if="curEnSolution">
                <a class="link-color" :href="`/problems/${metaData.info.questionName}/solution`" target="_blank">{{
                  langObj.originalLink
                }}</a>
                <div v-html="curEnSolution"></div>
              </template>
              <span v-else-if="metaData.data.enSolutionGeted">No solution or Solution locked</span>
            </template>
            <en-solution
              v-else-if="enDiscussList.length"
              :cur-solution-id="metaData.info.questionId"
              :cur-solution-title-slug="metaData.info.titleSlug"
              :list="enDiscussList"
              @set-resolve="setEnResolve"
            ></en-solution>
            <a-button v-else type="primary" size="small" @click="showSolution">{{ langObj.discuss }}</a-button>
          </template>
          <!-- zh -->
          <template v-else-if="zhDiscussList.length">
            <zh-solution
              :cur-solution-title-slug="metaData.info.titleSlug"
              :list="zhDiscussList"
              @set-resolve="setZhResolve"
            ></zh-solution>
          </template>
        </a-spin>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script setup>
import apiMap from '@/api'
import { abbreviateNumber } from '@/utils'
import parseContent from '@/utils/md-parse'
import ZhSolution from './zhSolution.vue'
import EnSolution from './enSolution.vue'

import { langEnum } from './const'

let metaData = reactive(initData())

let langObj = ref(langEnum)

let isZH = ref(location.origin.includes('leetcode-cn'))

let spinning = ref(false)

let descVisible = ref(false)

onMounted(clickListener)
onBeforeUnmount(() => window.removeEventListener('click-question'))

const showDesc = (msg) => {
  const { questionName, questionFullName } = msg
  metaData.info.questionName = questionName
  metaData.info.questionFullName = questionFullName
  apiMap
    .desc({
      questionName,
    })
    .then((res) => {
      metaData.data.desc = res.question.content
      metaData.data.descZH = res.question.translatedContent
      metaData.info.questionFullNameZH = res.question.translatedTitle
      metaData.info.questionId = res.question.questionId
      metaData.info.titleSlug = res.question.titleSlug
      descVisible.value = true
    })
}

function clickListener() {
  window.addEventListener(
    'click-question',
    function (e) {
      showDesc(e.detail)
    },
    { capture: true },
  )
}

const showSolution = () => {
  if (!curEnSolution.value && !zhDiscussList.value.length && !enDiscussList.value.length) {
    if (!isZH.value) {
      handleTabChange(metaData.activeKey)
    } else {
      spinning.value = true
      apiMap
        .zhDiscussList({
          questionName: metaData.info.questionName,
        })
        .then((res) => {
          const data = res.questionSolutionArticles.edges || []
          const discussList = data.map((item) => {
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
          metaData.data.zhDiscussList = discussList
        })
        .finally(() => {
          spinning.value = false
        })
    }
  }
}

const handleTabChange = (key) => {
  let { questionName, questionId } = metaData.info
  if (key === langEnum.tab1.key) {
    if (enDiscussList.value.length) return
    spinning.value = true
    apiMap
      .enDiscussList({ questionId })
      .then((res) => {
        const data = res.questionTopicsList.edges || []
        const discussList = data.map((item) => ({
          ...item.node,
          resove: '',
          voteCountText: abbreviateNumber(item.node.post.voteCount),
          viewCountText: abbreviateNumber(item.node.viewCount),
          title_format: item.node.title.replace(/\s/g, '-'),
        }))
        metaData.data.enDiscussList = discussList
      })
      .finally(() => {
        spinning.value = false
      })
  } else {
    if (metaData.data.enSolutionGeted) return
    spinning.value = true
    apiMap
      .solution({
        questionName,
      })
      .then((res) => {
        let solution = res.question.solution?.content
        if (solution) {
          metaData.data.enSolution = parseContent(solution, questionName)
        }
      })
      .finally(() => {
        spinning.value = false
        metaData.data.enSolutionGeted = true
      })
  }
}

function setEnResolve({ index, content }) {
  enDiscussList.value[index].resolve = parseContent(content, metaData.info.questionName)
}
function setZhResolve({ index, content }) {
  zhDiscussList.value[index].resolve = parseContent(content, metaData.info.questionName)
}

const curDesc = computed(() => metaData.data?.[isZH.value ? 'descZH' : 'desc'])
const curEnSolution = computed(() => metaData.data?.enSolution)
const zhDiscussList = computed(() => metaData.data?.zhDiscussList)
const enDiscussList = computed(() => metaData.data?.enDiscussList)
const curQuestionName = computed(() => metaData.info?.questionFullName)

function reset() {
  Object.assign(metaData, initData())
}

function initData() {
  return {
    activeKey: langEnum.tab1.key,
    data: {
      desc: '',
      descZH: '',
      enSolution: '',
      enSolutionGeted: false,
      zhDiscussList: [], // zh
      enDiscussList: [], // zh
    },
    info: {
      questionName: '',
      questionFullName: '',
      questionFullNameZH: '',
      questionId: '',
      titleSlug: '',
    },
  }
}
</script>
