<template>
  <div class="relative" v-for="(item, index) in list" :key="index">
    <component :is="item.tag"  v-bind="item.attrs" v-html="item.dom"></component>
    <a-button type="primary" class="absolute top-0 right-0" @click="showDrawer(list, index)">题目描述</a-button>
  </div>
  <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
</template>

<script setup>
  import {  ref } from 'vue'
  // import { apiParams } from './const'

  let visible = ref(false)

  const showDrawer = (list, index) => {
    visible.value = true
    console.log(list, index)
    const currentProblem = list[index]
    const problemTitle = currentProblem.childNodes[1]
    
    // apiParams
  }

  const onClose = () => {
    visible.value = false
  }
</script>