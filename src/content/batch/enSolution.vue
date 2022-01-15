<template>
  <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
    <a-tab-pane key="solution" tab="solution"></a-tab-pane>
    <a-tab-pane key="discuss" tab="discuss"></a-tab-pane>
  </a-tabs>
  <template v-if="props.curSolutionId">
    <p v-html="props.curSolution" v-if="activeKey === 'solution'"></p>
    <template v-else>
      <a-collapse v-model:activeKey="collapseActiveKey" accordion expand-icon-position="right" @change="currentDiscussResolve">
        <a-collapse-panel v-for="(item, index) in discussList" :key="index">
          <template v-slot:header>
             <a-row>
              <a-col :span="2">
                <a-avatar :src="item.post.author.profile.userAvatar"  class="mr-10"/>
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
          <p v-html="item.resolve" v-if="item.resolve"></p>
        </a-collapse-panel>
      </a-collapse>
    </template>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import apiMap from '@/api'
import { parseContent, abbreviateNumber } from '@/utils'

import {
  CaretUpOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'

import showdown from 'showdown'
const converter = new showdown.Converter()
converter.setOption('tasklists', true)

let activeKey = ref('solution')
let collapseActiveKey = ref('')


let props = defineProps({
  curSolution: String,
  curSolutionId: String,
})

let discussList = ref([])
const handleTabChange = (key) => {
  if (key === 'discuss' && !discussList.value.length) {
    // get most_votes discuss
    apiMap.discussList({ questionId: props.curSolutionId }).then(res => {
      const data = res.questionTopicsList.edges || []
      discussList.value = data.map(_v => ({
        ..._v.node,
        resove: '',
        voteCountText: abbreviateNumber(_v.node.post.voteCount),
        viewCountText: abbreviateNumber(_v.node.viewCount)
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
    apiMap.curDiscussResolve({ topicId: item.id }).then(res => {
      let data = res.topic.post.content || ''
      data = parseContent(data)
      discussList.value[index].resolve = converter.makeHtml(data)
    })
  }
}
</script>
