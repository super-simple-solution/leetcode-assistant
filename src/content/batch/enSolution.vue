<template>
  <a-collapse v-model:activeKey="activeKey" accordion expand-icon-position="right" @change="currentDiscussResolve">
    <a-collapse-panel v-for="(item, index) in props.list" :key="index">
      <template #header>
        <a-row>
          <a-col :span="2" class="flex items-center">
            <a-avatar :src="item.post.author.profile.userAvatar" class="mr-10" />
          </a-col>
          <a-col :span="16" class="flex items-center">{{ item.title }}</a-col>
          <a-col :span="3" class="flex items-center">
            <p class="flex items-center">
              <CaretUpOutlined class="mr-10" />
              <span>{{ item.voteCountText }}</span>
            </p>
          </a-col>
          <a-col :span="3" class="flex items-center">
            <p class="flex items-center">
              <EyeOutlined class="mr-10" />
              <span>{{ item.viewCountText }}</span>
            </p>
          </a-col>
        </a-row>
      </template>
      <a-spin :spinning="spinning">
        <a
          class="link-color"
          :href="`/problems/${props.curSolutionTitleSlug}/discuss/${item.id}/${item.title_format}`"
          target="_blank"
          >{{ langObj.originalLink }}</a
        >
        <div v-if="item.resolve" v-html="item.resolve"></div>
      </a-spin>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import apiMap from '@/api'

import { langEnum } from './const'
let langObj = ref(langEnum)

let activeKey = ref([])

let props = defineProps({
  curSolutionTitleSlug: String,
  list: Array,
})

const emit = defineEmits(['set-resolve'])

// get dicuss resove
let spinning = ref(false)
let curIndex = ref()
const currentDiscussResolve = (index) => {
  if (index === undefined) return
  curIndex.value = index
  let item = props.list[index]
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
