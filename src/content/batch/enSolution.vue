<template>
    <a-collapse v-model:activeKey="activeKey" accordion expand-icon-position="right" @change="currentDiscussResolve">
      <a-collapse-panel v-for="(item, index) in props.list" :key="index">
        <template v-slot:header>
          <a-row>
            <a-col :span="2"  class="flex aligns-item">
              <a-avatar :src="item.post.author.profile.userAvatar" class="mr-10"/>
            </a-col>
            <a-col :span="16"  class="flex aligns-item">{{ item.title }}</a-col>
            <a-col :span="3" class="flex aligns-item">
              <p class="flex items-center">
                <caret-up-outlined class="mr-10"/>
                <span>{{ item.voteCountText }}</span>
              </p>
            </a-col>
            <a-col :span="3" class="flex aligns-item">
              <p class="flex items-center">
                <eye-outlined class="mr-10"/>
                <span>{{ item.viewCountText }}</span>
              </p>
            </a-col>
          </a-row>
        </template>
        <a-spin :spinning="spinning">
          <a :href="`https://leetcode.com/problems/${props.curSolutionTitleSlug}/discuss/${item.id}/${item.title_format}`" target="_blank">查看原文</a>
          <p v-html="item.resolve" v-if="item.resolve"></p>
        </a-spin>
      </a-collapse-panel>
    </a-collapse>
</template>

<script setup>
import { ref } from 'vue'
import apiMap from '@/api'
import { parseContent } from '@/utils'

import {
  CaretUpOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'

import showdown from 'showdown'
const converter = new showdown.Converter()
converter.setOption('tasklists', true)

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
    apiMap.curDiscussResolve({ topicId: item.id }).then(res => {
      let data = res.topic.post.content || ''
      data = parseContent(data)
      emit('set-resolve', {
        index,
        content: converter.makeHtml(data)
      })
      spinning.value = false
    })
  }
}
</script>
