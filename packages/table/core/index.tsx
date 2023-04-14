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
  reactive,
} from "vue";
import {
  getNotUndefinedValueByOrder,
  renderComponent,
  getGlobalTableConfig,
  isNull,
  mergeListeners,
} from "@slacking/shared";
import TableColumn from "../components/TableColumn";
import { FormItemRender, useForm } from "@slacking/form";
import { tableProps } from "./tableProps";
import "./index.scss";
import { useSelect } from "./useSelect";

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
  const InnerTable = defineComponent({
    props: tableProps,
    setup(props, { emit }) {
      const formAttrs = ref<any>({});
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
        prop: "tableData",
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
              flattenedTableSchemaList.forEach((col: any) => {
                const prop = `${tableAttrs.value.prop}.${propIndex}.${col.prop}`;
                formModel[prop] = row[col.prop];
                formPropMap[prop] = col;
                rowMap.set(row, { commonRowProp: propIndex });
                const formItem = {
                  ...col,
                  prop,
                };
                if (col.list) {
                  formItem.list = col.list.map((item) => {
                    const prop = `${tableAttrs.value.prop}.${propIndex}.${item.prop}`;
                    return {
                      ...item,
                      prop,
                    };
                  });
                }
                formSchemaList.push(formItem);
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

      const { selectTableAttrsAndOns } = useSelect({
        tableAttrs,
        model,
        childrenKey,
        tableRef,
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
                  tableData: model.value,
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
  return { Table: InnerTable, formRef, tableRef } as {
    Table: any;
    formRef: ComputedRef<any>;
    tableRef: ComputedRef<any>;
  };
}
