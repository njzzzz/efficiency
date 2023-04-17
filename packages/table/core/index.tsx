import {
  defineComponent,
  toRefs,
  useAttrs,
  useSlots,
  ComputedRef,
  computed,
  useListeners,
  ref,
  watch,
  Ref,
} from "vue";
import {
  getNotUndefinedValueByOrder,
  renderComponent,
  getGlobalTableConfig,
  isNull,
  mergeListeners,
  sid,
} from "@slacking/shared";
import TableColumn from "../components/TableColumn";
import {
  DependOnOptions,
  FormItem,
  FormItemRender,
  useForm,
} from "@slacking/form";
import { tableProps } from "./tableProps";
import "./index.scss";
import { useSelect } from "./useSelect";
export const DEFAULT_TABLE_PROP = "tableData";

const globalTableConfig = getGlobalTableConfig();
const TableRender = defineComponent({
  setup() {
    const Table = renderComponent("Table");
    const attrs = useAttrs() as any;
    const slots = useSlots() as any;
    const listeners = useListeners();
    return () => {
      return (
        <Table
          ref={attrs.tableRef}
          {...{ attrs }}
          scopedSlots={slots}
          on={mergeListeners(attrs.ons ?? {}, listeners)}
        >
          {attrs?.columns?.length &&
            attrs.columns.map((column) => {
              return (
                <TableColumn
                  {...{
                    attrs: {
                      ...column,
                      formSchema: attrs.formAttrs.formSchema,
                    },
                  }}
                  key={column.columnIndex}
                  scopedSlots={{
                    default({ column }, args) {
                      const { commonRowProp } = attrs.formAttrs.rowMap.get(
                        args.row
                      );
                      const prop = `${attrs.prop}.${commonRowProp}.${column.prop}`;
                      const item = attrs.runtimeFormSchemaMap[prop];
                      return (
                        <FormItemRender
                          class={{
                            "is-readonly":
                              item.readonly ||
                              attrs.formAttrs.formSchema.readonly,
                          }}
                          item={item}
                        ></FormItemRender>
                      );
                    },
                  }}
                ></TableColumn>
              );
            })}
        </Table>
      );
    };
  },
}) as any;
export function useTable() {
  const tableRef = ref(null);
  const formAttrs = ref<any>({});
  const dependOnConfig = ref<any>({});
  const { Form, formRef, schema: runtimeFormSchema } = useForm();
  const FormItem = renderComponent("FormItem");
  const runtimeFormSchemaMap = computed(() => {
    return runtimeFormSchema.value?.list?.reduce?.((acc, item) => {
      if (item.prop) {
        acc[item.prop] = item;
      }
      return acc;
    }, {});
  });

  const defineDependOn = (_dependOnConfig = {}) => {
    dependOnConfig.value = _dependOnConfig;
  };

  const InnerTable = defineComponent({
    props: tableProps,
    setup(props, { emit }) {
      const { schema, model } = toRefs(props);
      const attrs = useAttrs() as any;
      const slots = useSlots() as any;
      const listeners = useListeners();
      const childrenKey = computed(() => {
        const { children = "children" } = tableAttrs.value.treeProps ?? {};
        return children;
      });
      function flattenTableSchemaList(list, flattenedList = []) {
        list.forEach((col) => {
          if (col.subHeaders) {
            flattenedList = [
              ...flattenTableSchemaList(col.subHeaders),
              ...flattenedList,
            ];
          } else {
            flattenedList.push(col);
          }
        });
        return flattenedList;
      }
      const tableAttrs = computed(() => ({
        prop: DEFAULT_TABLE_PROP,
        ...schema.value,
        ...attrs,
      }));

      watch(
        [schema, model],
        () => {
          const flattenedTableSchemaList = flattenTableSchemaList(
            schema.value.list
          );
          // 带children的index错误问题
          const rowMap = new WeakMap();
          const formModel = {} as any;
          const formPropMap = {} as any;
          const formSchema = {
            labelPosition: "left",
            hideLabelText: getNotUndefinedValueByOrder([
              schema.value.hideLabelText,
              globalTableConfig.hideLabelText,
              true,
            ]),
            hideRequiredAsterisk: getNotUndefinedValueByOrder([
              schema.value.hideRequiredAsterisk,
              globalTableConfig.hideRequiredAsterisk,
              false,
            ]),
            hideHeaderRequiredAsterisk: getNotUndefinedValueByOrder([
              schema.value.hideHeaderRequiredAsterisk,
              globalTableConfig.hideHeaderRequiredAsterisk,
              false,
            ]),
            ...schema.value,
            list: [],
          };
          function dealWithSchemaAndModel(
            list,
            parentProp = null,
            formSchemaList = []
          ) {
            list.forEach((row: any, rowIndex) => {
              const propIndex = !isNull(parentProp)
                ? `${parentProp}.${childrenKey.value}.${rowIndex}`
                : `${rowIndex}`;
              flattenedTableSchemaList.forEach((col: any, index) => {
                // 布局类型(配置了list)可能不会有prop生成一个虚拟prop, 用于后面table渲染
                col.prop = getNotUndefinedValueByOrder([col.prop, sid()]);
                const prop = `${tableAttrs.value.prop}.${propIndex}.${col.prop}`;
                const propWithoutTableProp = `${propIndex}.${col.prop}`;
                formModel[prop] = row[col.prop];
                formPropMap[prop] = col;
                rowMap.set(row, { commonRowProp: propIndex });
                const formItem = {
                  ...col,
                  prop,
                };
                if (col.list) {
                  formItem.list = col.list.map((item) => {
                    // 布局类型(配置了list)可能不会有prop生成一个虚拟prop
                    item.prop = getNotUndefinedValueByOrder([item.prop, sid()]);
                    const prop = `${tableAttrs.value.prop}.${propIndex}.${item.prop}`;
                    return {
                      ...item,
                      prop,
                    };
                  });
                }

                // dependOn映射
                if (formItem.dependOn) {
                  formItem.dependOn = Object.keys(formItem.dependOn).reduce(
                    (acc, onProp) => {
                      const dependOnOptions = formItem.dependOn[onProp];
                      const prop = `${tableAttrs.value.prop}.${propIndex}.${onProp}`;
                      acc[prop] = dependOnOptions;
                      return acc;
                    },
                    {}
                  );
                }
                // 自定义dependOn合并
                const defineDependOns =
                  dependOnConfig.value[propWithoutTableProp];
                if (defineDependOns) {
                  const _dependOn = formItem.dependOn ?? {};
                  const defineDependOns =
                    dependOnConfig.value[propWithoutTableProp];
                  formItem.dependOn = {
                    ..._dependOn,
                    ...Object.keys(defineDependOns).reduce((acc, _prop) => {
                      acc[`${tableAttrs.value.prop}.${_prop}`] =
                        defineDependOns[_prop];
                      return acc;
                    }, {}),
                  };
                }
                if (formItem.props?.type !== "selection") {
                  formSchemaList.push(formItem);
                }
              });
              if (row[childrenKey.value]) {
                dealWithSchemaAndModel(
                  row[childrenKey.value],
                  propIndex,
                  formSchemaList
                );
              }
            });
            return formSchemaList;
          }
          formSchema.list = dealWithSchemaAndModel(model.value);
          Object.assign(formAttrs.value, {
            formSchema,
            formModel,
            formPropMap,
            rowMap,
          });
          console.log(formAttrs.value);
        },
        { immediate: true }
      );

      const { selectTableAttrsAndOns, multiple } = useSelect({
        tableAttrs,
        model,
        childrenKey,
        tableRef,
        schema,
        emit,
      });

      return () => {
        return (
          <Form
            class="slacking-table"
            {...{
              attrs: {
                schema: formAttrs.value.formSchema,
                model: {
                  [tableAttrs.value.prop]: model.value,
                },
              },
            }}
            scopedSlots={{
              default() {
                return (
                  <FormItem
                    {...{ attrs: tableAttrs.value }}
                    prop={tableAttrs.value.prop}
                    class="slacking-table-form-item"
                  >
                    <TableRender
                      {...{
                        attrs: {
                          ...tableAttrs.value,
                          ...selectTableAttrsAndOns.value.attrs,
                        },
                      }}
                      on={mergeListeners(
                        listeners,
                        selectTableAttrsAndOns.value.on
                      )}
                      columns={schema.value.list}
                      data={model.value}
                      formAttrs={formAttrs.value}
                      runtimeFormSchemaMap={runtimeFormSchemaMap.value}
                      scopedSlots={slots}
                      tableRef={tableRef}
                    ></TableRender>
                  </FormItem>
                );
              },
            }}
          ></Form>
        );
      };
    },
  });
  return {
    Table: InnerTable,
    formRef,
    tableRef,
    defineDependOn,
  } as {
    Table: any;
    formRef: ComputedRef<any>;
    tableRef: ComputedRef<any>;
    defineDependOn: (
      dependOnConfig: Record<string, FormItem["dependOn"]>
    ) => unknown;
  };
}
