<template>
  <div role="rowgroup">
    <div class="flex flex-b" v-for="(item, index) in list" :key="index">
      <div :class="item.dom.className" v-html="item.dom.innerHTML"></div>
    </div>
  </div>
</template>

<script setup>
import { $$ } from '@/utils'

const list = $$('.content-list>li,.content-list>div>li').map(item => ({
  show: true,
  dom: item
}))
return {
  list: reactive(list)
}
console.log(11)
</script>