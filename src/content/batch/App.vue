<template>
  <component v-for="(item, index) in list" :key="index" :is="item.tag"  v-bind="item.attrs" v-html="item.dom"></component>
</template>

<script setup>
</script>