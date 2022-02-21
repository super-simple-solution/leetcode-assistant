<template>
  <a-collapse v-model:activeKey="activeKey" accordion expand-icon-position="right" @change="currentSolutionResolve">
    <a-collapse-panel v-for="(item, index) in props.list" :key="index">
      <template #header>
        <a-row>
          <a-col :span="2" class="flex items-center">
            <a-avatar :src="item.author.profile.userAvatar" class="mr-10" />
          </a-col>
          <a-col :span="16" class="flex items-center">{{ item.title }}</a-col>
          <a-col :span="3" class="flex items-center">
            <p class="flex items-center">
              <LikeOutlined class="mr-10" />
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
      <a class="link-color" :href="`/problems/${props.curSolutionTitleSlug}/solution/${item.slug}`" target="_blank">{{
        langObj.originalLink
      }}</a>
      <div v-html="item.resolve"></div>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import { LikeOutlined, EyeOutlined } from '@ant-design/icons-vue'
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
