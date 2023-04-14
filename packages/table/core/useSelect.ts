import { convertListToMap } from "@slacking/shared";
import { isUndef } from "@slacking/shared";
import { computed, onMounted, watch } from "vue";

export function useSelect({ tableAttrs, model, childrenKey, tableRef, emit }) {
  const multiple = computed(() => {
    return !!tableAttrs.value.multiple;
  });
  const isSelect = computed(() => !isUndef(tableAttrs.value.multiple));
  // 传入rowKey的情况下，默认使用rowKey去tableData里获取对象后调用table方法选中
  // 不传则默认为传入的值为对象或数组
  const hasRowKey = computed(() => !isUndef(tableAttrs.value.rowKey));
  const modelMap = computed(() => {
    return convertListToMap(
      model.value ?? [],
      {
        value: tableAttrs.value.rowKey,
        children: childrenKey,
      },
      false
    );
  });

  const value = computed({
    get() {
      return multiple.value ? 1 : tableAttrs.value.value;
    },
    set(v) {
      emit("input", v);
    },
  });
  const setCurrentRow = computed(() => tableRef.value?.setCurrentRow);
  const toggleRowSelection = computed(() => tableRef.value?.toggleRowSelection);
  onMounted(() => {
    // 开启选择必传multiple
    if (isSelect.value) {
      // 选中操作
      watch(
        value,
        (v) => {
          if (hasRowKey) {
            if (multiple.value) {
              v.forEach((key) => {
                const row = modelMap.value[key] ?? null;
                row && toggleRowSelection.value(row, true);
              });
            } else {
              const row = modelMap.value[v] ?? null;
              row && setCurrentRow.value(row);
            }
          } else {
            if (multiple.value) {
              v.forEach((row) => {
                row && toggleRowSelection.value(row, true);
              });
            } else {
              v && setCurrentRow.value(v);
            }
          }
        },
        { immediate: true }
      );
    }
  });
  const selectTableAttrsAndOns = computed(() => {
    if (isSelect.value) {
      if (multiple.value) {
        return {
          attrs: {},
          on: {},
        };
      } else {
        return {
          attrs: {
            highlightCurrentRow: true,
          },
          on: {
            "current-change"(val) {
              console.log("current-change3", val);

              value.value = val;
            },
          },
        };
      }
    } else {
      return {};
    }
  });

  //   const singleSelectValue = computed({
  //     get() {
  //       return tableAttrs.value.value;
  //     },
  //     set(v) {
  //       emits("input", v);
  //     },
  //   });
  //   const multipleSelectValue = ref([]);
  return {
    // singleSelectValue,
    // multipleSelectValue,
    multiple,
    selectTableAttrsAndOns,
  };
}
