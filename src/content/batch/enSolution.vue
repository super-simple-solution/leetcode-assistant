<template>
  <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
    <a-tab-pane key="discuss" tab="Discuss"></a-tab-pane>
    <a-tab-pane key="solution" tab="Solution"></a-tab-pane>
  </a-tabs>
  <template v-if="props.curSolutionId">
    <p v-html="props.curSolution" v-if="activeKey === 'solution'"></p>
    <template v-else>
      <a-collapse v-model:activeKey="collapseActiveKey" accordion expand-icon-position="right" @change="currentDiscussResolve">
        <a-collapse-panel v-for="(item, index) in discussList" :key="index">
          <template v-slot:header>
             <a-row>
              <a-col :span="2">
                <a-avatar :src="item.post.author.profile.userAvatar" class="mr-10"/>
              </a-col>
              <a-col :span="16">{{ item.title }}</a-col>
              <a-col :span="3">
                <p class="flex align-center">
                  <caret-up-outlined class="mr-10"/>
                  <span>{{ item.voteCountText }}</span>
                </p>
              </a-col>
              <a-col :span="3">
                <eye-outlined class="mr-10"/>
                <span>{{ item.viewCountText }}</span>
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
  </template>
</template>

<script setup>
import { ref, watch } from 'vue'
import apiMap from '@/api'
import { parseContent, abbreviateNumber } from '@/utils'

import {
  CaretUpOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'

import showdown from 'showdown'
const converter = new showdown.Converter()
converter.setOption('tasklists', true)

let activeKey = ref('discuss')
let collapseActiveKey = ref('')

let props = defineProps({
  curSolution: String,
  curSolutionId: String,
  curSolutionTitleSlug: String,
  descVisible: Boolean,
})

let discussList = ref([])
watch(props.curSolutionId, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    discussList.value = []
  }
})

let spinning = ref(false)
const handleTabChange = (key) => {
  if (key === 'discuss' && !discussList.value.length) {
    // get most_votes discuss
    apiMap.discussList({ questionId: props.curSolutionId }).then(res => {
      const data = res.questionTopicsList.edges || []
      discussList.value = data.map(_v => ({
        ..._v.node,
        resove: '',
        voteCountText: abbreviateNumber(_v.node.post.voteCount),
        viewCountText: abbreviateNumber(_v.node.viewCount),
        title_format: _v.node.title.replace(/\s/g, '-')
      }))
    })
  }
}

// get dicuss resove
let curIndex = ref()
const currentDiscussResolve = (index) => {
  if (index === undefined) return
  curIndex.value = index
  let item = discussList.value[index]
  const isExist = item.resolve
  if (!isExist) {
    spinning.value = true
    apiMap.curDiscussResolve({ topicId: item.id }).then(res => {
      let data = res.topic.post.content || ''
      data = parseContent(data)
      discussList.value[index].resolve = converter.makeHtml(data)
      spinning.value = false
    })
  }
}
</script>
