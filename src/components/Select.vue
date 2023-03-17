<template>
  <Select :value="value" placeholder="请选择" @input="$emit('input', $event)">
    <Option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></Option>
  </Select>
</template>

<script setup>
import { Select, Option } from "element-ui";
import { onMounted, onUpdated, defineProps } from "vue";
defineProps({
  options: {},
  value: {},
});
onUpdated(() => {
  console.count("updated");
});
onMounted(() => {
  console.count("onMounted");
});
</script>
