<template>
  <DatePicker
    :value="runtimeAttrs.value"
    v-bind="runtimeAttrs"
    v-on="$listeners"
  />
</template>
<script setup>
import { DatePicker } from "element-ui";
import { useOverrideProps } from "../hooks";
const { runtimeAttrs } = useOverrideProps();
</script>
