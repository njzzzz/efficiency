<template>
  <Select
    ref="selectRef"
    :value="value"
    :clearable="clearable"
    :filterable="filterable"
    :multiple="multiple"
    :filter-method="filterTree"
    @remove-tag="removeTag"
    @clear="clearSelect"
    @visible-change="selectVisibleChange"
  >
    <Option
      class="slacking-form-tree-select-option"
      value="unset"
      label="unset"
    >
      <Tree
        ref="treeRef"
        class="slacking-form-tree-select-tree"
        v-bind="{ ...runtimeTreeProps, ...$attrs }"
        v-on="{ ...runtimeTreeListeners, ...$listeners }"
      />
    </Option>
    <!-- 仅仅用于select展示 -->
    <Option
      v-for="item in selectOptions"
      v-show="false"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </Select>
</template>

<script setup>
import {
  computed,
  nextTick,
  ref,
  useAttrs,
  watch,
  defineEmits,
  defineProps,
} from "vue";
import { Tree, Select, Option } from "element-ui";
const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  value: {
    type: [String, Array, Number, null],
    default: () => [],
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: true,
  },
});
const attrs = useAttrs();
const emit = defineEmits(["input"]);
const treeRef = ref();
const selectRef = ref();
const runtimeValue = ref(attrs.value);

const selectOptions = computed(() => {
  if (props.multiple) {
    return runtimeValue.value?.length
      ? runtimeValue.value.map((item) => attrs?.__optionsMap?.[item])
      : [];
  } else {
    return attrs?.__optionsMap?.[runtimeValue.value]
      ? [attrs?.__optionsMap?.[runtimeValue.value]]
      : [];
  }
});
const defaultCheckedKeys = computed(() => {
  if (props.multiple) {
    return runtimeValue.value?.length ? runtimeValue.value : [];
  } else {
    return runtimeValue.value;
  }
});

const defaultExpandedKeys = computed(() => {
  if (props.multiple) {
    return runtimeValue.value?.length ? runtimeValue.value : [];
  } else {
    return [runtimeValue.value];
  }
});

watch(
  () => props.value,
  (value) => {
    runtimeValue.value = value;
  },
  { immediate: true, deep: true }
);

const treeCurrentChange = (currentNode, nodeObj) => {
  runtimeValue.value = currentNode.value;
  emit("input", runtimeValue.value);
  selectRef.value.blur();
};
const treeCheckChange = () => {
  // 仅返回叶子结点的数据
  const checked = treeRef.value.getCheckedKeys(true);
  runtimeValue.value = checked;
  emit("input", runtimeValue.value);
};

const selectVisibleChange = (visible) => {
  if (visible) {
    nextTick(() => {
      const selectDom = treeRef.value.$el.querySelector(".is-current");
      setTimeout(() => {
        selectRef.value.scrollToOption({ $el: selectDom });
      }, 0);
    });
    props.multiple && treeRef.value.setCheckedKeys(props.value);
  }
};
const clearSelect = () => {
  runtimeValue.value = props.multiple ? [] : null;
  emit("input", runtimeValue.value);
};

const runtimeTreeProps = computed(() => {
  const commonProps = {
    defaultExpandedKeys: defaultExpandedKeys.value,
    value: props.value,
    nodeKey: "value",
    data: props.options,
    highlightCurrent: true,
    filterNodeMethod: filterNode,
  };
  const specialProps = props.multiple
    ? {
        defaultCheckedKeys: defaultCheckedKeys.value,
        showCheckbox: true,
      }
    : {
        currentNodeKey: defaultCheckedKeys.value,
      };
  return {
    ...commonProps,
    ...specialProps,
  };
});
const runtimeTreeListeners = computed(() => {
  const commonListeners = {};
  const specialListeners = props.multiple
    ? {
        "check-change": treeCheckChange,
      }
    : {
        "current-change": treeCurrentChange,
      };
  return {
    ...commonListeners,
    ...specialListeners,
  };
});

const filterTree = (searchValue) => {
  treeRef.value.filter(searchValue);
};
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
const removeTag = (removed) => {
  runtimeValue.value = runtimeValue.value.filter((val) => val !== removed);
  treeRef.value.setChecked(removed, false);
  emit("input", runtimeValue.value);
};
</script>

<style scoped lang="scss">
.slacking-form-tree-select-option {
  height: auto;
  line-height: 1;
  padding: 0;
  background-color: #fff;
}
.slacking-form-tree-select-tree {
  padding: 4px 10px;
  font-weight: 400;
  ::v-deep .el-tree-node__content {
    padding: 0 10px;
  }
}
</style>
