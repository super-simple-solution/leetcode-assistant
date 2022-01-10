<template>
  <div class="relative" v-for="(item, index) in list" :key="index">
    <component :is="item.tag" v-bind="item.attrs" v-html="item.dom"></component>
    <a-button
      type="primary"
      size="small"
      class="absolute top-0 right-0"
      @click="showDesc(item, index)"
    >描述</a-button>
  </div>
  <a-drawer
    :title="curQuestionName"
    placement="left"
    :closable="false"
    v-model:visible="descVisible"
    width="800"
  >
    <p v-html="curDesc"></p>
    <a-button type="primary" size="small" @click="showSolution">题解</a-button>
    <a-drawer
      v-model:visible="solutionVisible"
      title="题解"
      placement="left"
      width="600"
      :closable="false"
    >
      <p v-html="curSolution"></p>
    </a-drawer>
  </a-drawer>
</template>

<script setup>
import apiMap from '@/api'
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  list: Array,
})

let list = ref(props.list)

let descVisible = ref(false)
let solutionVisible = ref(false)
let curIndex = ref()

const showDesc = (item, index) => {
  curIndex.value = index
  if (item.data.desc) {
    descVisible.value = true
  } else {
    apiMap.desc({
      questionName: item.info.questionName
    }).then(res => {
      item.data.desc = res.content
      item.info.questionId = res.questionId
      descVisible.value = true
    })
  }
}

const showSolution = () => {
  console.log(curSolution.value, 22222)
  if (curSolution.value) {
    solutionVisible.value = true
  } else {
    apiMap.solution({
      questionName: curItem.value.info.questionName
    }).then(res => {
      console.log(res, 'res')  // todo
      curItem.value.data.solution = res.content
      solutionVisible.value = true
    })
  }
}

const curItem = computed(() => list.value[curIndex.value] || {})
const curDesc = computed(() => curItem.value.data?.desc)
const curSolution = computed(() => curItem.value.data?.solution)
const curQuestionName = computed(() => curItem.value.info?.questionFullName)
</script>