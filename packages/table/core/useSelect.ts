import { convertListToMap } from "@slacking/shared";
import { isUndef } from "@slacking/shared";
import { computed, onMounted, watch } from "vue";

export function useSelect({
  tableAttrs,
  model,
  childrenKey,
  tableRef,
  schema,
  emit,
}) {
  const multiple = computed(() => {
    return !!tableAttrs.value.multiple;
  });
  const isSelect = computed(() => !isUndef(tableAttrs.value.multiple));
  // 传入rowKey的情况下，默认使用rowKey去tableData里获取对象后调用table方法选中
  // 不传则默认为传入的值为对象或数组
  const hasRowKey = computed(() => !isUndef(tableAttrs.value.rowKey));
  const rowKey = computed(() => tableAttrs.value.rowKey);
  const modelMap = computed(() => {
    return convertListToMap(
      model.value ?? [],
      {
        value: tableAttrs.value.rowKey,
        children: childrenKey.value,
      },
      false
    );
  });

  const value = computed({
    get() {
      return tableAttrs.value.value;
    },
    set(v) {
      emit("input", v);
    },
  });
  const setCurrentRow = computed(() => tableRef.value?.setCurrentRow);
  const toggleRowSelection = computed(() => tableRef.value?.toggleRowSelection);
  const clearSelection = computed(() => tableRef.value?.clearSelection);
  onMounted(() => {
    // 开启选择必传multiple
    if (isSelect.value) {
      // 选中操作
      watch(
        value,
        (v) => {
          clearSelection.value();
          if (hasRowKey.value) {
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
  const getRowValue = (row) => {
    return hasRowKey.value ? row[rowKey.value] : row;
  };
  const compareIsSameRow = (row, selectRow) => {
    return row === getRowValue(selectRow);
  };
  const compareIsDiffRow = (row, selectRow) => {
    return row !== getRowValue(selectRow);
  };
  const selectTableAttrsAndOns = computed(() => {
    if (isSelect.value) {
      if (multiple.value) {
        return {
          attrs: {},
          on: {
            select(selection, row) {
              const isChecked = value.value.filter((item) =>
                compareIsSameRow(item, row)
              );
              if (isChecked.length) {
                value.value = value.value.filter((item) =>
                  compareIsDiffRow(item, row)
                );
              } else {
                value.value = [...value.value, getRowValue(row)];
              }
            },
            // TODO: 带折叠children的选择暂不支持
            "select-all"(selection) {
              if (selection.length) {
                const selectedValueList = value.value;
                const selected = value.value.length
                  ? model.value.filter(
                      (tableItem) =>
                        !selectedValueList.includes(getRowValue(tableItem))
                    )
                  : model.value;
                value.value = [...value.value, ...selected.map(getRowValue)];
              } else {
                const excludeKeys = model.value.map((tableItem) =>
                  getRowValue(tableItem)
                );
                const selected = value.value.filter(
                  (item) => !excludeKeys.includes(item)
                );
                value.value = selected;
              }
            },
          },
        };
      } else {
        return {
          attrs: {
            highlightCurrentRow: true,
          },
          on: {
            "current-change"(val) {
              value.value = hasRowKey.value ? val[rowKey.value] : val;
            },
          },
        };
      }
    } else {
      return {};
    }
  });

  return {
    multiple,
    selectTableAttrsAndOns,
  };
}
