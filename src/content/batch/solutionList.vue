<template>
  <a-collapse v-model:activeKey="activeKey" accordion expand-icon-position="right" @change="currentSolutionResolve">
    <a-collapse-panel v-for="(item, index) in meta.list" :key="index">
      <template v-slot:header>
        <span>{{ item.title }}</span>
        <p>{{ item.desc }}</p>
      </template>
      <p v-html="item.resolve"></p>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import apiMap from '@/api'
import { ref, reactive, computed } from 'vue'
import { parseContent } from '@/utils'

import showdown from 'showdown'
const converter = new showdown.Converter()
converter.setOption('tasklists', true)

const activeKey = ref([])
let props = defineProps({
  list: Array
})

let curIndex = ref()

let meta = reactive({
  list: props.list
})

const currentSolutionResolve = (index) => {
  if (index === undefined) return
  curIndex.value = index
  let item = meta.list[index]
  const isExist = item.resolve
  if (!isExist) {
    apiMap.curSolutionResolve({ slug: item.slug }).then(res => {
      let data = res.solutionArticle.content || ''
      data = parseContent(data)
      item.resolve = converter.makeHtml(data)
    })
  }
}

const curItem = computed(() => meta.list[curIndex.value] || {})
</script>
