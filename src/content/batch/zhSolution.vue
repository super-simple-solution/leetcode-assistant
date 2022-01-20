<template>
  <a-collapse v-model:activeKey="activeKey" accordion expand-icon-position="right" @change="currentSolutionResolve">
    <a-collapse-panel v-for="(item, index) in props.list" :key="index">
      <template v-slot:header>
        <span>{{ item.title }}</span>
        <p>{{ item.desc }}</p>
      </template>
      <a :href="`https://leetcode-cn.com/problems/${props.curSolutionTitleSlug}/solution/${item.slug}`" target="_blank">{{ langObj.zh.discussLink }}</a>
      <!-- https://leetcode-cn.com/problems/n-queens/solution/nhuang-hou-by-leetcode-solution/ -->
      <p v-html="item.resolve"></p>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import apiMap from '@/api'
import { ref  } from 'vue'
import parseContent from '@/utils/md-parse'

import { langEnum } from './const'
let langObj = ref(langEnum)

const activeKey = ref([])
let props = defineProps({
  curSolutionTitleSlug: String,
  list: Array
})

const emit = defineEmits(['set-resolve'])
let curIndex = ref()
const currentSolutionResolve = (index) => {
  if (index === undefined) return
  curIndex.value = index
  let item = props.list[index]
  const isExist = item.resolve
  if (!isExist) {
    apiMap.curSolutionResolve({ slug: item.slug }).then(res => {
      let data = res.solutionArticle.content || ''
      emit('set-resolve', {
        index,
        content: parseContent(data)
      })
    })
  }
}
</script>
