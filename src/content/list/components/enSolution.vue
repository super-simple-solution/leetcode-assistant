<template>
  <a-collapse v-model:activeKey="activeKey" accordion expand-icon-position="right" @change="currentDiscussResolve">
    <a-collapse-panel v-for="(item, index) in props.list" :key="index">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-3">
            <a-avatar :src="item.post.author.profile.userAvatar" />
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
      <a-spin :spinning="spinning">
        <a-tooltip>
          <template #title>{{ langEnum.originalLink }}</template>
          <a
            class="link-color float-right"
            :href="`/problems/${props.curSolutionTitleSlug}/discuss/${item.id}/${item.title_format}`"
            target="_blank"
          >
            <LinkOutlined />
          </a>
        </a-tooltip>
        <div v-if="item.resolve" v-html="item.resolve"></div>
      </a-spin>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import { LikeOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons-vue'
import apiMap from '@/api'

import { langEnum } from '../const'

const activeKey = ref([])

const props = defineProps({
  curSolutionTitleSlug: String,
  list: Array,
})

const emit = defineEmits(['set-resolve'])

// get dicuss resove
const spinning = ref(false)
const curIndex = ref()
const currentDiscussResolve = (index) => {
  if (index === undefined) return
  curIndex.value = index
  const item = props.list[index]
  const isExist = item.resolve
  if (!isExist) {
    spinning.value = true
    apiMap.curDiscussResolve({ topicId: item.id }).then((res) => {
      emit('set-resolve', {
        index,
        content: res.topic.post.content || '',
      })
      spinning.value = false
    })
  }
}
</script>
