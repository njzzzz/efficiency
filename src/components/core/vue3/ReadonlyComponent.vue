<template>
  <span>{{ modelValue }}</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number, Array, Object],
      default: "",
    },
  },
  setup() {
    return {};
  },
});
</script>
