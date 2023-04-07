import { Ref } from "vue";
import { genRuntimeFormProp } from "./useConfig";

export function useHandleInit() {
  function generatorOns(item, runtimeTableModel, dataIndex, columnIndex) {
    const prop = genRuntimeFormProp({
      prop: item.originProp,
      dataIndex,
      columnIndex,
      list: item.list,
    });
    return {
      prop,
      ons: {
        ...(item.ons ?? {}),
        input(val, args) {
          if (!runtimeTableModel.value[dataIndex]) return;
          const originInputOn = item.on?.input;
          if (item.originProp !== undefined) {
            runtimeTableModel.value[dataIndex][item.originProp] = val;
          }
          originInputOn && originInputOn(val, args);
        },
        objectValue(val, args) {
          if (!runtimeTableModel.value[dataIndex]) return;
          const { model } = args;
          const originOnObjectValue = item.on?.objectValue;
          const objectValueKey = `_${prop}`;
          if (Reflect.has(model.value, objectValueKey)) {
            runtimeTableModel.value[dataIndex][`_${item.originProp}`] =
              model.value[objectValueKey];
          }
          originOnObjectValue && originOnObjectValue(val, args);
        },
        mixValue(val, args) {
          if (!runtimeTableModel.value[dataIndex]) return;
          const { item: runtimeItem } = args;
          const originOnObjectValue = item.on?.mixValue;
          const realValue = runtimeItem.list.reduce((acc, subItem) => {
            const { originProp, prop } = subItem;
            if (originProp !== undefined) {
              acc[originProp] = val[prop];
            }
            return acc;
          }, {});
          runtimeTableModel.value[dataIndex][item.originProp] = realValue;
          originOnObjectValue && originOnObjectValue(val, args);
        },
        defaultValue(val, args) {
          const originDefaultValueOn = item.on?.defaultValue;
          if (item.originProp !== undefined) {
            runtimeTableModel.value[dataIndex][item.originProp] = val;
          }
          originDefaultValueOn && originDefaultValueOn(val, args);
        },
      },
    };
  }

  function genFormSchema(
    runtimeTableSchema: Ref<any>,
    runtimeTableModel: Ref<any>
  ) {
    const runtimeFormSchemaList = [];
    let columnIndex = -1;
    function iteratorList(list, dataIndex, sameRow = false) {
      const newList = [];
      list.forEach((item, index) => {
        item.originProp = Reflect.has(item, "originProp")
          ? item.originProp
          : item.prop;
        if (item.subHeaders) {
          iteratorList(item.subHeaders, dataIndex);
        } else if (item.list) {
          !sameRow && (columnIndex += 1);
          item.type = "Mix";
          item.columnIndex = columnIndex;
          const { prop, ons } = generatorOns(
            item,
            runtimeTableModel,
            dataIndex,
            columnIndex
          );
          const formItem = {
            ...item,
            prop,
            list: iteratorList(item.list, dataIndex, true),
            columnIndex,
            dataIndex,
            ons,
          };
          runtimeFormSchemaList.push(formItem);
          newList.push(formItem);
        } else if (item.prop !== undefined) {
          !sameRow && (columnIndex += 1);
          item.columnIndex = columnIndex;
          const { prop, ons } = generatorOns(
            item,
            runtimeTableModel,
            dataIndex,
            columnIndex
          );
          const formItem = {
            ...item,
            prop,
            columnIndex,
            dataIndex,
            ons,
          };
          runtimeFormSchemaList.push(formItem);
          newList.push(formItem);
        }
      });
      return newList;
    }
    if (runtimeTableModel.value?.length) {
      runtimeTableModel.value.forEach((row, dataIndex) => {
        iteratorList(runtimeTableSchema.value.list ?? [], dataIndex);
        columnIndex = -1;
      });
    }
    return runtimeFormSchemaList;
  }
  const genFormModel = (runtimeFormSchema, runtimeTableModel) => {
    const runtimeFormModel = {};
    function iteratorList(list) {
      list.forEach((item) => {
        if (item.prop !== undefined) {
          const { originProp, dataIndex } = item;
          runtimeFormModel[item.prop] =
            runtimeTableModel.value[dataIndex][originProp];
        } else if (item.list) {
          iteratorList(item.list);
        }
      });
    }
    if (runtimeFormSchema.value?.list?.length) {
      iteratorList(runtimeFormSchema.value?.list);
    }
    return runtimeFormModel;
  };

  return {
    genFormModel,
    genFormSchema,
  };
}
