<template>
  <a-drawer v-model:visible="descVisible" placement="bottom" :closable="false" height="600" @close="reset">
    <template #title>
      <a-row :gutter="10">
        <a-col :span="12">
          <span class="question-name">{{ curQuestionName }}</span>
        </a-col>
        <a-col :span="12">
          <a-tabs v-if="!isZH" v-model:activeKey="metaData.activeKey" @change="handleTabChange">
            <a-tab-pane :key="langEnum.tab1.key" :tab="langEnum.tab1.tab"></a-tab-pane>
            <a-tab-pane :key="langEnum.tab2.key" :tab="langEnum.tab2.tab"></a-tab-pane>
          </a-tabs>
          <a-button v-else type="primary" size="small" class="mt-2" @click="showSolution">{{
            langEnum.discuss
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
            <template v-if="metaData.activeKey == langEnum.tab2.key">
              <template v-if="curEnSolution">
                <a-tooltip>
                  <template #title>{{ langEnum.originalLink }}</template>
                  <a
                    class="link-color float-right"
                    :href="`/problems/${metaData.info.questionName}/solution`"
                    target="_blank"
                    ><LinkOutlined
                  /></a>
                </a-tooltip>
                <div v-html="curEnSolution"></div>
              </template>
              <span v-else-if="metaData.data.enSolutionGeted">No solution or Solution locked</span>
            </template>
            <template v-else-if="discussList.length">
              <!-- discuss tag -->
              <div class="mb-2">
                Tags:
                <template v-for="(item, index) in metaData.tagList" :key="index">
                  <a-checkable-tag
                    :checked="selectedTags.includes(item.slug)"
                    @change="(checked) => tagChange(item, checked)"
                  >
                    {{ item.slug }}
                  </a-checkable-tag>
                </template>
              </div>
              <en-solution
                :cur-solution-id="metaData.info.questionId"
                :cur-solution-title-slug="metaData.info.titleSlug"
                :list="discussList"
                @set-resolve="setResolve"
              ></en-solution>
            </template>
            <a-button v-else type="primary" size="small" @click="showSolution">{{ langEnum.discuss }}</a-button>
          </template>
          <!-- zh -->
          <template v-else-if="discussList.length">
            Tags:
            <template v-for="(item, index) in metaData.tagList" :key="index">
              <a-checkable-tag
                :checked="selectedTags.includes(item.slug)"
                @change="(checked) => tagChange(item, checked)"
              >
                {{ item.slug }}
              </a-checkable-tag>
            </template>
            <zh-solution
              :cur-solution-title-slug="metaData.info.titleSlug"
              :list="discussList"
              @set-resolve="setResolve"
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
import { LinkOutlined } from '@ant-design/icons-vue'
import apiMap from '@/api'
import parseContent from '@/utils/md-parse'
import ZhSolution from './components/zhSolution.vue'
import EnSolution from './components/enSolution.vue'
import useTag from '@/use/useTag'
import { initData, getEnDiscussList, getZhDiscussList } from './util'
import { isZH } from './const'

import { langEnum } from './const'

const metaData = reactive(initData())

const spinning = ref(false)

const descVisible = ref(false)

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
  const { questionName, questionId } = metaData.info
  if (key === langEnum.tab1.key) {
    if (discussList.value.length) return
    getDiscussList()
    const { tags } = await useTag({ questionId: +questionId })
    metaData.tagList = tags
  } else {
    if (metaData.data.enSolutionGeted) return
    spinning.value = true
    apiMap
      .solution({
        questionName,
      })
      .then((res) => {
        const solution = res.question.solution?.content
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
  const { questionName, questionId, tagSlugs, tags } = {
    ...metaData.info,
    ...options,
  }
  const skip = (metaData.data.pageNum - 1) * 15
  let api
  let params
  if (isZH) {
    api = getZhDiscussList
    params = {
      questionName,
      skip,
      tagSlugs,
    }
  } else {
    api = getEnDiscussList
    params = {
      questionId,
      skip,
      tags,
    }
  }
  api(params)
    .then(discussListCb)
    .finally(() => {
      spinning.value = false
    })
}

function discussListCb(data) {
  metaData.data.discussList = data.discussList
  metaData.data.totalNum = data.totalNum
}

const selectedTags = ref([])
async function tagChange(item, checked) {
  const nextSelectedTags = checked
    ? [...selectedTags.value, item.slug]
    : selectedTags.value.filter((t) => t !== item.slug)
  selectedTags.value = nextSelectedTags
  let discussParams
  let tagParams
  if (isZH) {
    discussParams = { questionName: item.questionName, tagSlugs: selectedTags.value }
    tagParams = { questionName: item.questionName, selectedTags: selectedTags.value }
  } else {
    discussParams = { questionId: item.questionId, tags: selectedTags.value }
    tagParams = { questionId: +item.questionId, selectedTags: selectedTags.value }
  }
  const { tags } = await useTag(tagParams)
  metaData.tagList = tags
  getDiscussList(discussParams)
}

async function showSolution() {
  if (!curEnSolution.value && !discussList.value.length) {
    if (!isZH) {
      handleTabChange(metaData.activeKey)
    } else {
      getDiscussList()
      const { tags } = await useTag({ questionName: metaData.info.questionName })
      metaData.tagList = tags
    }
  }
}

function setResolve({ index, content }) {
  discussList.value[index].resolve = parseContent(content, metaData.info.questionName)
}

const curDesc = computed(() => metaData.data?.[isZH ? 'descZH' : 'desc'])
const curEnSolution = computed(() => metaData.data?.enSolution)
const discussList = computed(() => metaData.data?.discussList)
const curQuestionName = computed(() => metaData.info?.questionFullName)
const showPagination = computed(() => {
  return langEnum.tab1?.key === metaData.data?.activeKey && discussList.value.length
})

function reset() {
  Object.assign(metaData, initData())
}
</script>
