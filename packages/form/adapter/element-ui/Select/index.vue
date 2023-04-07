<template>
  <Select v-bind="$attrs" v-on="$listeners">
    <Option
      v-for="item in $attrs.options"
      v-bind="item"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </Select>
</template>
<script setup>
import { Select, Option } from "element-ui";
</script>
