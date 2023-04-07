<template>
  <TimeSelect
    :value="runtimeAttrs.value"
    v-bind="runtimeAttrs"
    v-on="$listeners"
  />
</template>
<script setup>
import { TimeSelect } from "element-ui";
import { useOverrideProps } from "../hooks";
const { runtimeAttrs } = useOverrideProps();
</script>
