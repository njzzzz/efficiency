import {
  defineComponent,
  toRefs,
  useAttrs,
  useSlots,
  ComputedRef,
  computed,
} from "vue";
import {
  getNotUndefinedValueByOrder,
  renderComponent,
  getGlobalTableConfig,
  isNull,
} from "@slacking/shared";
import TableColumn from "../components/TableColumn";
import { FormItemRender, useForm } from "@slacking/form";
import { tableProps } from "./tableProps";
import "./index.scss";

const globalTableConfig = getGlobalTableConfig();
const TableRender = defineComponent({
  setup() {
    const Table = renderComponent("Table");
    const attrs = useAttrs() as any;
    const slots = useSlots() as any;
    return () => {
      return (
        <Table {...{ attrs }} scopedSlots={slots}>
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
  const [Form, formModel, formRef, runtimeFormSchema] = useForm();
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
      const { schema, model } = toRefs(props);
      const attrs = useAttrs() as any;
      const slots = useSlots() as any;
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
      const formAttrs = computed(() => {
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
              ? `${parentProp}.children.${rowIndex}`
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
            if (row.children) {
              dealWithSchemaAndModel(row.children, propIndex, formSchemaList);
            }
          });
          return formSchemaList;
        }
        formSchema.list = dealWithSchemaAndModel(model.value);
        return { formSchema, formModel, formPropMap, rowMap };
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
                      {...{ attrs: tableAttrs.value }}
                      columns={schema.value.list}
                      data={model.value}
                      formAttrs={formAttrs.value}
                      runtimeFormSchemaMap={runtimeFormSchemaMap.value}
                      scopedSlots={slots}
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
  return [InnerTable, formRef] as [any, ComputedRef<any>];
}
