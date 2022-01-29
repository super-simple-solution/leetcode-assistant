<template>
  <a-collapse v-model:activeKey="activeKey" accordion expand-icon-position="right" @change="currentSolutionResolve">
    <a-collapse-panel v-for="(item, index) in props.list" :key="index">
      <template #header>
        <span>{{ item.title }}</span>
        <p>{{ item.desc }}</p>
      </template>
      <a class="link-color" :href="`/problems/${props.curSolutionTitleSlug}/solution/${item.slug}`" target="_blank">{{
        langObj.originalLink
      }}</a>
      <div v-html="item.resolve"></div>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import apiMap from '@/api'

import { langEnum } from './const'
let langObj = ref(langEnum)

const activeKey = ref([])
let props = defineProps({
  curSolutionTitleSlug: String,
  list: Array,
})

const emit = defineEmits(['set-resolve'])
let curIndex = ref()
const currentSolutionResolve = (index) => {
  if (index === undefined) return
  curIndex.value = index
  let item = props.list[index]
  const isExist = item.resolve
  if (!isExist) {
    apiMap.curSolutionResolve({ slug: item.slug }).then((res) => {
      emit('set-resolve', {
        index,
        content: res.solutionArticle.content || '',
      })
    })
  }
}
</script>
