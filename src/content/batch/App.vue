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
          <a-button class="fr" type="primary" size="small" @click="showSolution">题解</a-button>
        </a-col>
      </a-row>
    </template>
    <a-row>
      <a-col :span="12">
        <p v-html="curDesc"></p>
      </a-col>
      <a-col :span="12">
        <template v-if="!isZH">
          <template v-if="curItem.info.questionId">
            <en-solution :cur-solution="curSolution" :cur-solution-id="curItem.info.questionId"></en-solution>
          </template>
        </template>
        <template v-else>
          <solution-list :list="curSolutionList" v-if="curSolutionList.length"></solution-list>
        </template>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script setup>
import apiMap from '@/api'
import showdown from 'showdown'
import { parseContent } from '@/utils'
import { ref, computed, reactive } from 'vue'
import SolutionList from './solutionList.vue'
import EnSolution from './enSolution.vue'

let isZH = ref(location.origin.includes('leetcode-cn'))

let converter = new showdown.Converter()
converter.setOption('tasklists', true)

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
      descVisible.value = true
    })
  }
}

const showSolution = () => {
  console.log(343)
  if (!curSolution.value && !curSolutionList.value.length) {
    if (!isZH.value) {
      apiMap.solution({
        questionName: curItem.value.info.questionName
      }).then(res => {
        let solution = res.question.solution.content || ''
        if (solution) {
          solution = parseContent(solution)
          let solutionHTML = converter.makeHtml(solution)
          curItem.value.data.solution = solutionHTML
        } else {
          curItem.value.data.solution = 'no solution'
        }
      })
    } else {
      apiMap.solutionList({
        questionName: curItem.value.info.questionName
      }).then(res => {
        const data = res.questionSolutionArticles.edges || []
        const solutionList = data.map(_v => ({
          ..._v.node,
          key: _v.node.slug,
          resolve: '',
          desc: _v.node.summary.slice(0, 40),
        }))
        curItem.value.data.solutionList = solutionList
      })
    }
  }
}

const curItem = computed(() => meta.list[curIndex.value] || {})
const curDesc = computed(() => curItem.value.data?.[isZH.value ? 'descZH' : 'desc'])
const curSolution = computed(() => curItem.value.data?.solution)
const curSolutionList = computed(() => curItem.value.data?.solutionList)
const curQuestionName = computed(() => curItem.value.info?.questionFullName)
</script>