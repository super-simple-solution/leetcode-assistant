<template>
  <div class="relative" v-for="(item, index) in list" :key="index">
    <component :is="item.tag"  v-bind="item.attrs" v-html="item.dom"></component>
    <a-button type="primary" size="small" class="absolute top-0 right-0" @click="showDrawer(item, index)">描述</a-button>
  </div>
  <a-drawer
      :title="list[curIndex || 0].info.questionFullName"
      placement="left"
      :closable="false"
      :visible="visible"
      width="800"
      @close="onClose"
    >
      <a-button type="primary" size="small" @click="showSolution">Two-level drawer</a-button>
      <p v-html="list[curIndex || 0].data.desc"></p>
    </a-drawer>
</template>

<script>
export default {
  setup() {

  },
}
import { Drawer } from 'ant-design-vue'
import { desc } from '@/api'
import {  computed, ref } from 'vue'

let visible = ref(false)
let curIndex = ref()

const showDrawer = (item, index) => {
  curIndex.value = index
  if (item.data.desc) {
    visible.value = true
  } else {
    desc({
      questionName: item.info.questionName
    }).then(res => {
      console.log(res, 'res')
      item.data.desc = res.content
      item.info.questionId = res.questionId
      visible.value = true
    })
  }
}

const showSolution = () => {
  let   = curIndex.value
  if (item.data.desc) {
    visible.value = true
  } else {
    desc({
      questionName: item.info.questionName
    }).then(res => {
      console.log(res, 'res')
      item.data.desc = res.content
      item.info.questionId = res.questionId
      visible.value = true
    })
  }
}

const onClose = () => {
  visible.value = false
}

// const curDesc = computed(() => {
//   return list[curIndex.value].data.desc || ''
// })
</script>