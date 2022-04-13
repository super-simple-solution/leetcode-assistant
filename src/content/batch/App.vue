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
          <template v-if="!isZH">
            <template v-if="metaData.activeKey == langObj.tab2.key">
              <template v-if="curEnSolution">
                <a
                  class="link-color right"
                  :href="`/problems/${metaData.info.questionName}/solution`"
                  target="_blank"
                  >{{ langObj.originalLink }}</a
                >
                <div v-html="curEnSolution"></div>
              </template>
              <span v-else-if="metaData.data.enSolutionGeted">No solution or Solution locked</span>
            </template>
            <template v-else-if="enDiscussList.length">
              <!-- discuss tag -->
              Tags:
              <template v-for="(item, index) in metaData.tag.enList" :key="index">
                <a-checkable-tag
                  :checked="selectedTags.indexOf(item.slug) > -1"
                  @change="(checked) => handleChange(item, checked)"
                >
                  {{ item.slug }}
                </a-checkable-tag>
              </template>
              <en-solution
                :cur-solution-id="metaData.info.questionId"
                :cur-solution-title-slug="metaData.info.titleSlug"
                :list="enDiscussList"
                @set-resolve="setEnResolve"
              ></en-solution>
            </template>
            <a-button v-else type="primary" size="small" @click="showSolution">{{ langObj.discuss }}</a-button>
          </template>
          <!-- zh -->
          <template v-else-if="zhDiscussList.length">
            Tags:
            <template v-for="(item, index) in metaData.tag.zhList" :key="index">
              <a-checkable-tag
                :checked="selectedTags.indexOf(item.slug) > -1"
                @change="(checked) => handleChange(item, checked)"
              >
                {{ item.slug }}
              </a-checkable-tag>
            </template>
            <zh-solution
              :cur-solution-title-slug="metaData.info.titleSlug"
              :list="zhDiscussList"
              @set-resolve="setZhResolve"
            ></zh-solution>
          </template>
          <a-pagination
            v-if="showPagination"
            v-model:current="metaData.data.pageNum"
            class="pagination"
            size="small"
            :total="metaData.data.totalNum"
            @change="getDiscussList()"
          />
        </a-spin>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script setup>
import apiMap from '@/api'
import parseContent from '@/utils/md-parse'
import ZhSolution from './zhSolution.vue'
import EnSolution from './enSolution.vue'
import useTag from '@/use/useTag'
import { initData, getEnDiscussList, getZhDiscussList } from './util'
import { isZH } from './const'

import { langEnum } from './const'

let metaData = reactive(initData())

let langObj = langEnum

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
// discuss tag
async function handleTabChange(key) {
  let { questionName, questionId } = metaData.info
  if (key === langEnum.tab1.key) {
    if (enDiscussList.value.length) return
    getDiscussList()
    const { tags } = await useTag({ questionId: +questionId })
    metaData.tag.enList = tags
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

function getDiscussList(options = {}) {
  spinning.value = true
  let { questionName, questionId } = {
    ...metaData.info,
    ...options,
  }
  let skip = (metaData.data.pageNum - 1) * 15
  let api
  let params
  if (isZH) {
    api = getZhDiscussList
    params = {
      questionName,
      skip,
    }
  } else {
    api = getEnDiscussList
    params = {
      questionId,
      skip,
    }
  }
  api(params)
    .then(discussListCb)
    .finally(() => {
      spinning.value = false
    })
}

function discussListCb(data) {
  let listKey = isZH ? 'zhDiscussList' : 'enDiscussList'
  metaData.data[listKey] = data.discussList
  metaData.data.totalNum = data.totalNum
}

let selectedTags = ref([])
async function handleChange(item, checked) {
  const nextSelectedTags = checked
    ? [...selectedTags.value, item.slug]
    : selectedTags.value.filter((t) => t !== item.slug)
  selectedTags.value = nextSelectedTags
  let discussParams
  if (isZH) {
    discussParams = { questionName: item.questionName, tagSlugs: selectedTags.value }
    const { tags } = await useTag({ questionName: item.questionName, selectedTags: selectedTags.value })
    metaData.tag.zhList = tags
  } else {
    discussParams = { questionId: item.questionId, tags: selectedTags.value }
    const { tags } = await useTag({ questionId: +item.questionId, selectedTags: selectedTags.value })
    metaData.tag.enList = tags
  }
  getDiscussList(discussParams)
}

async function showSolution() {
  if (!curEnSolution.value && !zhDiscussList.value.length && !enDiscussList.value.length) {
    if (!isZH) {
      handleTabChange(metaData.activeKey)
    } else {
      getDiscussList()
      const { tags } = await useTag({ questionName: metaData.info.questionName })
      metaData.tag.zhList = tags
    }
  }
}

function setEnResolve({ index, content }) {
  enDiscussList.value[index].resolve = parseContent(content, metaData.info.questionName)
}
function setZhResolve({ index, content }) {
  zhDiscussList.value[index].resolve = parseContent(content, metaData.info.questionName)
}

const curDesc = computed(() => metaData.data?.[isZH ? 'descZH' : 'desc'])
const curEnSolution = computed(() => metaData.data?.enSolution)
const zhDiscussList = computed(() => metaData.data?.zhDiscussList)
const enDiscussList = computed(() => metaData.data?.enDiscussList)
const curQuestionName = computed(() => metaData.info?.questionFullName)
const showPagination = computed(
  () => langObj.tab1.key === metaData.activeKey && (zhDiscussList.length || enDiscussList.length),
)

function reset() {
  Object.assign(metaData, initData())
}
</script>
