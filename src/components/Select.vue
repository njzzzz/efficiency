<template>
  <Select
    :value="value"
    placeholder="请选择"
    :clearable="clearable"
    :filterable="filterable"
    :multiple="multiple"
    @input="$emit('input', $event)"
  >
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
import { cloneDeep } from "lodash-es";
import {
  onMounted,
  onUpdated,
  defineProps,
  onRenderTriggered,
  useAttrs,
} from "vue";
defineProps({
  options: {},
  value: {},
  clearable: {},
  multiple: {},
  filterable: {},
});
const attrs = useAttrs();
console.log("【LOG】  attrs ---->", attrs);
onUpdated(() => {
  console.count("updated");
});
onMounted(() => {
  console.count("onMounted");
});
onRenderTriggered((e) => {
  console.log("select triggered", cloneDeep(e.oldValue), cloneDeep(e.newValue));
});
</script>
