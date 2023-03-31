import { useInitScopedSlots } from "./useConfig";

export function useHandleInit() {
  function init(columns, data, schema) {
    if (Array.isArray(columns)) {
      for (let index = 0; index < columns.length; index++) {
        const column = columns[index];
        useInitScopedSlots(column, data, schema);
        if (Array.isArray(column.list)) {
          init(column.list, data, schema);
        }
      }
    }
  }
  return {
    init,
  };
}
