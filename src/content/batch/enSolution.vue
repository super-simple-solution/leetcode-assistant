<template>
    <a-collapse v-model:activeKey="activeKey" accordion expand-icon-position="right" @change="currentDiscussResolve">
      <a-collapse-panel v-for="(item, index) in props.list" :key="index">
        <template v-slot:header>
          <a-row>
            <a-col :span="2"  class="flex items-center">
              <a-avatar :src="item.post.author.profile.userAvatar" class="mr-10"/>
            </a-col>
            <a-col :span="16"  class="flex items-center">{{ item.title }}</a-col>
            <a-col :span="3" class="flex items-center">
              <p class="flex items-center">
                <caret-up-outlined class="mr-10"/>
                <span>{{ item.voteCountText }}</span>
              </p>
            </a-col>
            <a-col :span="3" class="flex items-center">
              <p class="flex items-center">
                <eye-outlined class="mr-10"/>
                <span>{{ item.viewCountText }}</span>
              </p>
            </a-col>
          </a-row>
        </template>
        <a-spin :spinning="spinning">
          <a :href="`https://leetcode.com/problems/${props.curSolutionTitleSlug}/discuss/${item.id}/${item.title_format}`" target="_blank">{{ langObj.en.discussLink }}</a>
          <p v-html="item.resolve" v-if="item.resolve"></p>
        </a-spin>
      </a-collapse-panel>
    </a-collapse>
</template>

<script setup>
import { ref } from 'vue'
import apiMap from '@/api'
import parseContent from '@/utils/md-parse'

import { langEnum } from './const'
let langObj = ref(langEnum)

import {
  CaretUpOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'

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
      emit('set-resolve', {
        index,
        content: parseContent(data)
      })
      spinning.value = false
    })
  }
}
</script>
