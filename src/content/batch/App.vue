<template>
  <a-drawer
    placement="bottom"
    :closable="false"
    v-model:visible="descVisible"
    height="600"
  >
    <template v-slot:title>
      <a-row  :gutter="10">
        <a-col :span="12">
          <span class="mr-20">{{ curQuestionName }}</span>
        </a-col>
        <a-col :span="12">
          <a-button type="primary" size="small" @click="showSolution">{{  langObj[lang].discuss  }}</a-button>
        </a-col>
      </a-row>
    </template>
    <a-row :gutter="10">
      <a-col :span="12">
        <p v-html="curDesc"></p>
      </a-col>
      <a-col :span="12">
        <a-spin :spinning="spinning">
          <!-- en -->
          <template v-if="!isZH">
            <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
              <a-tab-pane :key="langObj.en.tab1.key" :tab="langObj.en.tab1.tab"></a-tab-pane>
              <a-tab-pane :key="langObj.en.tab2.key" :tab="langObj.en.tab2.tab"></a-tab-pane>
            </a-tabs>
            <p v-html="curEnSolution" v-if="activeKey == langObj.en.tab2.key"></p>
            <en-solution
              v-else
              :cur-solution-id="metaData.info.questionId" 
              :cur-solution-title-slug="metaData.info.titleSlug"
              :list="enDiscussList"
              @set-resolve="setEnResolve"
            ></en-solution>
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
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import ZhSolution from './zhSolution.vue'
import EnSolution from './enSolution.vue'

import { langEnum } from './const'

let metaData = reactive({
  data: {
    desc: '',
    descZH: '',
    enSolution: '',
    zhDiscussList: [], // zh
    enDiscussList: [], // zh
  },
  info: {
    questionName: '',
    questionFullName: '',
    questionFullNameZH: '',
    questionId: '',
    titleSlug: '',
  }
})

let langObj = ref(langEnum)

let isZH = ref(location.origin.includes('leetcode-cn'))
let lang = ref(isZH.value ? 'zh' : 'en')

let spinning = ref(false)

let descVisible = ref(false)

onMounted(clickListener)

onBeforeUnmount(() => window.removeEventListener('click-question'))


const showDesc = (questionName) => {
  if (!questionName) return
  metaData.info.questionName = questionName
  apiMap.desc({
    questionName,
  }).then(res => {
    metaData.data.desc = res.question.content
    metaData.data.descZH = res.question.translatedContent
    metaData.info.questionFullNameZH = res.question.translatedTitle
    metaData.info.questionId = res.question.questionId
    metaData.info.titleSlug = res.question.titleSlug
    descVisible.value = true
  })
}

function clickListener() {
  window.addEventListener('click-question', function (e) {
    showDesc(e.detail.questionName)
  }, { capture: true })
}

let activeKey = ref(langEnum.en.tab1.key)
const showSolution = () => {
  if (!curEnSolution.value && !zhDiscussList.value.length && !enDiscussList.value.length) {
    if (!isZH.value) {
      handleTabChange(activeKey.value)
    } else {
      spinning.value = true
      apiMap.zhDiscussList({
        questionName: metaData.info.questionName
      }).then(res => {
        const data = res.questionSolutionArticles.edges || []
        const discussList = data.map(_v => ({
          ..._v.node,
          key: _v.node.slug,
          resolve: '',
          desc: _v.node.summary.slice(0, 40),
        }))
        metaData.data.zhDiscussList = discussList
        spinning.value = false
      })
    }
  }
}

const handleTabChange = (key) => {
  if (key === langEnum.en.tab1.key) {
    if (enDiscussList.value.length) return
    spinning.value = true
    apiMap.enDiscussList({ questionId:  metaData.info.questionId}).then(res => {
      const data = res.questionTopicsList.edges || []
      const discussList = data.map(_v => ({
        ..._v.node,
        resove: '',
        voteCountText: abbreviateNumber(_v.node.post.voteCount),
        viewCountText: abbreviateNumber(_v.node.viewCount),
        title_format: _v.node.title.replace(/\s/g, '-')
      }))
      metaData.data.enDiscussList = discussList
      spinning.value = false
    })
  } else {
    if (curEnSolution.value) return
    spinning.value = true
    apiMap.solution({
      questionName: metaData.info.questionName
      }).then(res => {
        let solution = res.question.solution.content || ''
        if (solution) {
          metaData.data.enSolution = parseContent(solution)
        } else {
          metaData.data.enSolution = 'no solution'
        }
        spinning.value = false
      })
  }
}

function setEnResolve({ index, content }) {
  enDiscussList.value[index].resolve = content
}
function setZhResolve({ index, content }) {
  zhDiscussList.value[index].resolve = content
}

const curDesc = computed(() => metaData.data?.[isZH.value ? 'descZH' : 'desc'])
const curEnSolution = computed(() => metaData.data?.enSolution)
const zhDiscussList = computed(() => metaData.data?.zhDiscussList)
const enDiscussList = computed(() => metaData.data?.enDiscussList)
const curQuestionName = computed(() => metaData.info?.questionFullName)

</script>