<template>
  <div role="rowgroup">
    <div class="flex flex-b" v-for="(item, index) in list" :key="index">
      <div :class="item.dom.className" v-html="item.dom.innerHTML"></div>
    </div>
  </div>
</template>

<script setup>
import { $$ } from '@/utils'
import { ref } from 'vue'
let list = ref([])
list.value = $$('[role="rowgroup"]>[ role="row"]').map(item => ({
  show: true,
  dom: item
}))
</script>