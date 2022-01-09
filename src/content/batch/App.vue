<template>
  <div class="relative" v-for="(item, index) in list" :key="index">
    <component :is="item.tag"  v-bind="item.attrs" v-html="item.dom"></component>
    <a-button type="primary" class="absolute top-0 right-0" @click="showDrawer(item, index)">题目描述</a-button>
  </div>
  <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <p v-html="list[curIndex || 0].data.desc"></p>
    </a-drawer>
</template>

<script setup>
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

const onClose = () => {
  visible.value = false
}

// const curDesc = computed(() => {
//   return list[curIndex.value].data.desc || ''
// })
</script>