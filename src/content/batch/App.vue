<template>
  <div class="relative" v-for="(item, index) in meta.list" :key="index">
    <component :is="item.tag" v-bind="item.attrs" v-html="item.dom"></component>
    <a-button
      type="primary"
      size="small"
      class="absolute top-0 right-0"
      @click="showDesc(item, index)"
    >描述</a-button>
  </div>
  <a-drawer
    placement="bottom"
    :closable="false"
    v-model:visible="descVisible"
    height="600"
  >
    <template v-slot:title>
      <a-row>
        <a-col :span="12">
          <span class="mr-20">{{ curQuestionName }}</span>
        </a-col>
        <a-col :span="12">
          <a-button type="primary" size="small" @click="showSolution">{{ discussTitle }}</a-button>
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
            <a-tab-pane key="discuss" tab="Discuss"></a-tab-pane>
            <a-tab-pane key="solution" tab="Solution"></a-tab-pane>
          </a-tabs>
          <p v-html="curEnSolution" v-if="activeKey == 'solution'"></p>
          <en-solution
            v-else
            :cur-solution-id="curItem.info.questionId" 
            :cur-solution-title-slug="curItem.info.titleSlug"
            :list="enDiscussList"
            @set-resolve="setEnResolve"
          ></en-solution>
        </template>
        <!-- zh -->
        <template v-else-if="zhDiscussList.length">
          <zh-solution
            :cur-solution-title-slug="curItem.info.titleSlug"
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
import showdown from 'showdown'
import { parseContent, abbreviateNumber } from '@/utils'
import { ref, computed, reactive } from 'vue'
import ZhSolution from './zhSolution.vue'
import EnSolution from './enSolution.vue'

let isZH = ref(location.origin.includes('leetcode-cn'))

const discussTitle = ref(isZH.value ? '获取题解': 'Get discuss')

let converter = new showdown.Converter()
converter.setOption('tasklists', true)

let spinning = ref(false)
let props = defineProps({
  list: Array
})

let meta = reactive({
  list: props.list
})

let descVisible = ref(false)
let curIndex = ref()

const showDesc = (item, index) => {
  curIndex.value = index
  if (item.data.desc) {
    descVisible.value = true
  } else {
    apiMap.desc({
      questionName: item.info.questionName
    }).then(res => {
      item.data.desc = res.question.content
      item.data.descZH = res.question.translatedContent
      item.info.questionFullNameZH = res.question.translatedTitle
      item.info.questionId = res.question.questionId
      item.info.titleSlug = res.question.titleSlug
      descVisible.value = true
    })
  }
}

let activeKey = ref('discuss')
const showSolution = () => {
if (!curEnSolution.value && !zhDiscussList.value.length && !enDiscussList.value.length) {
    if (!isZH.value) {
      handleTabChange(activeKey.value)
    } else {
      spinning.value = true
      apiMap.zhDiscussList({
        questionName: curItem.value.info.questionName
      }).then(res => {
        const data = res.questionSolutionArticles.edges || []
        const discussList = data.map(_v => ({
          ..._v.node,
          key: _v.node.slug,
          resolve: '',
          desc: _v.node.summary.slice(0, 40),
        }))
        curItem.value.data.zhDiscussList = discussList
        spinning.value = false
      })
    }
  }
}

const handleTabChange = (key) => {
  if (key === 'discuss') {
    if (enDiscussList.value.length) return
    spinning.value = true
    apiMap.enDiscussList({ questionId:  curItem.value.info.questionId}).then(res => {
      const data = res.questionTopicsList.edges || []
      const discussList = data.map(_v => ({
        ..._v.node,
        resove: '',
        voteCountText: abbreviateNumber(_v.node.post.voteCount),
        viewCountText: abbreviateNumber(_v.node.viewCount),
        title_format: _v.node.title.replace(/\s/g, '-')
      }))
      curItem.value.data.enDiscussList = discussList
      spinning.value = false
    })
  } else {
    if (curEnSolution.value) return
    spinning.value = true
    apiMap.solution({
      questionName: curItem.value.info.questionName
      }).then(res => {
        let solution = res.question.solution.content || ''
        if (solution) {
          solution = parseContent(solution)
          let solutionHTML = converter.makeHtml(solution)
          curItem.value.data.enSolution = solutionHTML
        } else {
          curItem.value.data.enSolution = 'no solution'
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

const curItem = computed(() => meta.list[curIndex.value] || {})
const curDesc = computed(() => curItem.value.data?.[isZH.value ? 'descZH' : 'desc'])
const curEnSolution = computed(() => curItem.value.data?.enSolution)
const zhDiscussList = computed(() => curItem.value.data?.zhDiscussList)
const enDiscussList = computed(() => curItem.value.data?.enDiscussList)
const curQuestionName = computed(() => curItem.value.info?.questionFullName)
</script>