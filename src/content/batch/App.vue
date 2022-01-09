<template>
  <div class="relative" v-for="(item, index) in list" :key="index">
    <component :is="item.tag"  v-bind="item.attrs" v-html="item.dom"></component>
    <a-button type="primary" class="absolute top-0 right-0">题目描述</a-button>
  </div>
</template>

<script setup>
</script>