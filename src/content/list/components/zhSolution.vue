<template>
  <a-collapse v-model:activeKey="activeKey" accordion expand-icon-position="right" @change="currentSolutionResolve">
    <a-collapse-panel v-for="(item, index) in props.list" :key="index">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-3">
            <a-avatar :src="item.author.profile.userAvatar" />
            <div class="font-bold">{{ item.title }}</div>
          </div>
          <div class="flex w-[120px] justify-between">
            <div class="flex items-center gap-1">
              <LikeOutlined />
              <span>{{ item.voteCountText }}</span>
            </div>
            <div class="flex items-center gap-1">
              <EyeOutlined />
              <span>{{ item.viewCountText }}</span>
            </div>
          </div>
        </div>
      </template>
      <a-tooltip>
        <template #title>{{ langEnum.originalLink }}</template>
        <a
          class="link-color float-right"
          :href="`/problems/${props.curSolutionTitleSlug}/solution/${item.slug}`"
          target="_blank"
        >
          <LinkOutlined />
        </a>
      </a-tooltip>
      <div v-html="item.resolve"></div>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import { LikeOutlined, EyeOutlined } from '@ant-design/icons-vue'
import apiMap from '@/api'

import { langEnum } from '../const'

const activeKey = ref([])
const props = defineProps({
  curSolutionTitleSlug: String,
  list: Array,
})

const emit = defineEmits(['set-resolve'])
const curIndex = ref()
const currentSolutionResolve = (index) => {
  if (index === undefined) return
  curIndex.value = index
  const item = props.list[index]
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
