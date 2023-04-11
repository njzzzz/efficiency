import { Ref } from "vue";
import { genRuntimeFormProp } from "./useConfig";
import { sid } from "@slacking/shared";

export function useHandleInit({ runtimeAttrs }) {
  function generatorOns({
    item,
    runtimeTableModel,
    // 拍平后row的index
    dataIndex,
    columnIndex,
    row,
  }) {
    const { __topIndex, __index, __parent } = row;
    const isChild = !!__parent;
    const prop = genRuntimeFormProp({
      prop: item.originProp,
      dataIndex,
      columnIndex,
      list: item.list,
    });
    return {
      prop,
      // 重写ons做值映射
      ons: {
        ...(item.ons ?? {}),
        // emit('input')
        input(val, args) {
          if (!runtimeTableModel.value[__topIndex]) return;
          const originInputOn = item.ons?.input;
          if (item.originProp !== undefined) {
            if (isChild) {
              runtimeTableModel.value[__topIndex].children[__index][
                item.originProp
              ] = val;
            } else {
              runtimeTableModel.value[__topIndex][item.originProp] = val;
            }
          }
          originInputOn && originInputOn(val, args);
        },
        // 选择类型的表单，触发对象转换
        objectValue(val, args) {
          if (!runtimeTableModel.value[__topIndex]) return;
          const { model } = args;
          const originOnObjectValue = item.ons?.objectValue;
          const objectValueKey = `_${prop}`;
          if (Reflect.has(model.value, objectValueKey)) {
            if (isChild) {
              runtimeTableModel.value[__topIndex].children[__index][
                `_${item.originProp}`
              ] = model.value[objectValueKey];
            } else {
              runtimeTableModel.value[__topIndex][`_${item.originProp}`] =
                model.value[objectValueKey];
            }
          }
          originOnObjectValue && originOnObjectValue(val, args);
        },
        // 类型为Mix的,值改变触发
        mixValue(val, args) {
          if (!runtimeTableModel.value[__topIndex]) return;
          const { item: runtimeItem } = args;
          if (item.originProp === undefined) return;
          const originOnObjectValue = item.ons?.mixValue;
          const realValue = runtimeItem.list.reduce((acc, subItem) => {
            const { originProp, prop } = subItem;
            if (originProp !== undefined) {
              acc[originProp] = val[prop];
            }
            return acc;
          }, {});
          if (isChild) {
            runtimeTableModel.value[__topIndex].children[__index][
              item.originProp
            ] = realValue;
          } else {
            runtimeTableModel.value[__topIndex][item.originProp] = realValue;
          }
          originOnObjectValue && originOnObjectValue(val, args);
        },
        // 修改默认值时触发
        defaultValue(val, args) {
          const originDefaultValueOn = item.ons?.defaultValue;
          if (item.originProp !== undefined) {
            if (isChild) {
              // 初始化树状节点rowKeyId
              runtimeTableModel.value[__topIndex].children[__index] =
                runtimeTableModel.value[__topIndex].children[__index]
                  ? runtimeTableModel.value[__topIndex].children[__index]
                  : {
                      [runtimeAttrs.value.rowKey]: sid(),
                      __index: __topIndex,
                    };
              runtimeTableModel.value[__topIndex].children[__index][
                item.originProp
              ] = val;
            } else {
              runtimeTableModel.value[__topIndex][item.originProp] = val;
            }
          }
          originDefaultValueOn && originDefaultValueOn(val, args);
        },
      },
    };
  }

  function genFormSchema({
    runtimeTableSchema,
    runtimeTableModel,
    flattenedTableModel,
  }: {
    runtimeTableSchema: Ref<any>;
    runtimeTableModel: Ref<any>;
    flattenedTableModel: any;
  }) {
    const runtimeFormSchemaList = [];
    let columnIndex = -1;
    function iteratorList(list, row, dataIndex, sameRow = false) {
      const newList = [];
      list.forEach((item) => {
        item.originProp = Reflect.has(item, "originProp")
          ? item.originProp
          : item.prop;
        if (item.subHeaders) {
          iteratorList(item.subHeaders, row, dataIndex);
        } else if (item.list) {
          !sameRow && (columnIndex += 1);
          item.type = "Mix";
          item.columnIndex = columnIndex;
          const { prop, ons } = generatorOns({
            item,
            runtimeTableModel,
            // 拍平后row的index
            dataIndex,
            columnIndex,
            row,
          });
          const formItem = {
            ...item,
            prop,
            list: iteratorList(item.list, row, dataIndex, true),
            columnIndex,
            dataIndex,
            ons,
          };
          formItem.isChild = row.__parent !== null;
          if (formItem.isChild) {
            formItem.__topIndex = row.__topIndex;
            formItem.__index = row.__index;
          }
          runtimeFormSchemaList.push(formItem);
          newList.push(formItem);
        } else if (item.prop !== undefined) {
          !sameRow && (columnIndex += 1);
          item.columnIndex = columnIndex;
          const { prop, ons } = generatorOns({
            item,
            runtimeTableModel,
            // 拍平后row的index
            dataIndex,
            columnIndex,
            row,
          });
          const formItem = {
            ...item,
            prop,
            columnIndex,
            dataIndex,
            ons,
          };
          formItem.isChild = row.__parent !== null;
          if (formItem.isChild) {
            formItem.__topIndex = row.__topIndex;
            formItem.__index = row.__index;
          }
          runtimeFormSchemaList.push(formItem);
          newList.push(formItem);
        }
      });
      return newList;
    }

    if (runtimeTableModel.value?.length) {
      flattenedTableModel.forEach((row, dataIndex) => {
        iteratorList(runtimeTableSchema.value.list ?? [], row, dataIndex);
        columnIndex = -1;
      });
    }
    return runtimeFormSchemaList;
  }
  const genFormModel = ({
    runtimeFormSchema,
    runtimeTableModel,
    flattenedTableModel,
  }: {
    runtimeFormSchema: Ref<any>;
    runtimeTableModel: Ref<any>;
    flattenedTableModel: any;
  }) => {
    const runtimeFormModel = {};
    function iteratorList(list) {
      list.forEach((item) => {
        if (item.prop !== undefined) {
          const { originProp, dataIndex } = item;
          runtimeFormModel[item.prop] =
            flattenedTableModel[dataIndex]?.[originProp];
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
