<template>
  <Cascader
    v-bind="$attrs"
    :value="runtimeValue"
    :props="{
      multiple: $attrs.multiple,
      ...$attrs.props,
    }"
    v-on="runtimeListeners"
  />
</template>
<script setup>
import { computed, defineEmits, ref, useAttrs, useListeners, watch } from "vue";
import { Cascader } from "element-ui";
const attrs = useAttrs();
const listeners = useListeners();
const runtimeValue = ref(attrs.value);
const emit = defineEmits(["input"]);
const updateModel = ($event) => {
  emit(
    "input",
    attrs.multiple ? $event.map((item) => item.at(-1)) : $event.at(-1)
  );
};
watch(
  () => attrs.value,
  (newValue) => {
    if (attrs.multiple) {
      runtimeValue.value = newValue?.length
        ? newValue.map((val) => attrs.__optionsMap[val].__path)
        : [];
    } else {
      runtimeValue.value = attrs.__optionsMap[newValue]
        ? attrs.__optionsMap[newValue].__path
        : [];
    }
  },
  { immediate: true, deep: true }
);

const runtimeListeners = computed(() => {
  return {
    ...listeners,
    input: updateModel,
  };
});
</script>
<style lang="scss"></style>
