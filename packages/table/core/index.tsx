import {
  defineComponent,
  toRefs,
  useAttrs,
  useSlots,
  ref,
  watch,
  ComputedRef,
  Ref,
  computed,
} from "vue";
import {
  getNotUndefinedValueByOrder,
  renderComponent,
  getGlobalTableConfig,
} from "@slacking/shared";
import TableColumn from "../components/TableColumn";
import { useHandleInit } from "./useHandleInit";
import { FormItemWithMixRender, useForm } from "@slacking/form";
import { cloneDeep } from "lodash-es";
import { tableProps } from "./tableProps";
import { genRuntimeFormProp } from "./useConfig";
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
                      formSchema: attrs.formSchema,
                    },
                  }}
                  key={column.columnIndex}
                  scopedSlots={{
                    default({ column }, { $index, row }) {
                      const prop = genRuntimeFormProp({
                        prop: column.originProp,
                        dataIndex: $index,
                        columnIndex: column.columnIndex,
                        list: column.list,
                      });
                      const item = attrs.runtimeFormSchemaMap[prop];
                      return (
                        <FormItemWithMixRender
                          item={item}
                        ></FormItemWithMixRender>
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
  const [Form, formModel, formRef, formSchema] = useForm();
  // 表单配置
  const runtimeFormSchema = ref<any>({});
  // 表单数据
  const runtimeFormModel = ref<any>({});
  // 表格数据
  const runtimeTableModel = ref<any>([]);
  // 表格配置
  const runtimeTableSchema = ref<any>({});
  const runtimeFormSchemaMap = computed(() => {
    return formSchema.value?.list?.reduce?.((acc, item) => {
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
      const { genFormSchema, genFormModel } = useHandleInit();
      watch(
        [schema, model],
        () => {
          runtimeTableSchema.value = cloneDeep(schema.value);
          runtimeTableModel.value = model.value;
          const formSchemaList = genFormSchema(
            runtimeTableSchema,
            runtimeTableModel
          );
          runtimeFormSchema.value = {
            labelPosition: "left",
            hideLabelText: getNotUndefinedValueByOrder([
              runtimeTableSchema.value.hideLabelText,
              globalTableConfig.hideLabelText,
              true,
            ]),
            hideRequiredAsterisk: getNotUndefinedValueByOrder([
              runtimeTableSchema.value.hideRequiredAsterisk,
              globalTableConfig.hideRequiredAsterisk,
              false,
            ]),
            hideHeaderRequiredAsterisk: getNotUndefinedValueByOrder([
              runtimeTableSchema.value.hideHeaderRequiredAsterisk,
              globalTableConfig.hideHeaderRequiredAsterisk,
              false,
            ]),
            ...runtimeTableSchema.value,
            list: formSchemaList,
          };
          runtimeFormModel.value = genFormModel(
            runtimeFormSchema,
            runtimeTableModel
          );
        },
        {
          immediate: true,
        }
      );
      watch(
        runtimeTableModel,
        () => {
          emit("input", runtimeTableModel.value);
        },
        {
          deep: true,
          immediate: true,
        }
      );
      return () => {
        return (
          <Form
            class="slacking-table"
            {...{
              attrs: {
                schema: runtimeFormSchema.value,
                model: runtimeFormModel.value,
              },
            }}
            scopedSlots={{
              render() {
                return (
                  <TableRender
                    {...{ attrs }}
                    columns={runtimeTableSchema.value.list}
                    data={runtimeTableModel.value}
                    runtimeFormSchemaMap={runtimeFormSchemaMap.value}
                    formSchema={formSchema.value}
                    scopedSlots={slots}
                  ></TableRender>
                );
              },
            }}
          ></Form>
        );
      };
    },
  });
  return [InnerTable, formRef, runtimeTableModel, runtimeTableSchema] as [
    any,
    ComputedRef<any>,
    Ref<any>,
    Ref<any>
  ];
}
