import {
  computed,
  defineComponent,
  toRefs,
  useAttrs,
  useSlots,
  ref,
  watch,
} from "vue";
import { renderComponent } from "@slacking/shared";
import TableColumn from "../components/TableColumn";
import { useHandleInit } from "./useHandleInit";
import { defineFormSchema, useForm } from "@slacking/form";
import {
  createVirtualModel,
  createVirtualSchema,
  genVirtualProp,
  VIRTUAL_MODEL_KEY,
} from "./useConfig";
import { tableProps } from "./tableProps";

const TableRender = defineComponent({
  setup() {
    const Table = renderComponent("Table");
    const attrs = useAttrs() as any;
    const slots = useSlots() as any;
    return () => (
      <Table {...{ attrs }} scopedSlots={slots}>
        {attrs.initRender()}
        {attrs?.columns?.length &&
          attrs.columns.map((column) => {
            return (
              <TableColumn
                {...{
                  attrs: column,
                }}
                scopedSlots={{
                  default({ column: realColumn, subIndex }, realData) {
                    const realRow = realData.row ?? {};
                    const subDeep = realData.column.level - 1;
                    const dataIndex = realData.$index;
                    const realProp = attrs.formSchemaMap[realColumn.prop] ?? [];
                    let schemaIndex = null;
                    const sameSubDeepItem = realProp.filter(
                      (item) => item.subDeep === subDeep
                    );
                    if (sameSubDeepItem?.length) {
                      // 作为多级表头的字节点
                      schemaIndex = sameSubDeepItem[0]?.schemaIndex;
                    } else {
                      //作为正常表格列
                      schemaIndex = realProp[0]?.schemaIndex;
                    }
                    // schemaIndex 都一样直接获取第一个就行
                    const virtualProp = genVirtualProp({
                      config: realColumn,
                      dataIndex,
                      schemaIndex,
                      subDeep,
                      subIndex,
                      changeConfig: false,
                    });
                    console.log(attrs.formItemRenderMap);
                    const Render = attrs.formItemRenderMap[virtualProp]?.value;
                    return Render ? <Render></Render> : null;
                  },
                  ...column.scopedSlots,
                }}
              ></TableColumn>
            );
          })}
      </Table>
    );
  },
}) as any;

export function useTable() {
  const InnerTable = defineComponent({
    props: tableProps,
    setup(props) {
      const [Form] = useForm();
      const { schema, model } = toRefs(props);
      const attrs = useAttrs() as any;
      const slots = useSlots() as any;
      const formSchema = ref({});
      const virtualModel = ref({});
      const formSchemaMap = ref({});
      watch(
        () => [schema.value, model.value],
        () => {
          const {
            formSchema: runtimeFormSchema,
            formSchemaMap: runtimeFormSchemaMap,
          } = createVirtualSchema(model.value, schema.value);
          formSchema.value = runtimeFormSchema;
          formSchemaMap.value = runtimeFormSchemaMap;
          virtualModel.value = createVirtualModel(
            model.value,
            formSchema.value
          );
        },
        { immediate: true, deep: true }
      );

      return () =>
        schema.value?.readonly ? (
          <TableRender
            {...{ attrs }}
            columns={schema.value.list}
            data={model.value}
            scopedSlots={slots}
          ></TableRender>
        ) : (
          <Form
            {...{
              attrs: {
                schema: formSchema.value,
                model: virtualModel.value,
              },
            }}
            scopedSlots={{
              render(initRender, formItemRenderMap) {
                console.log(
                  "【LOG】  formItemRenderMap ---->",
                  formItemRenderMap
                );
                return (
                  <TableRender
                    {...{ attrs }}
                    columns={schema.value.list}
                    data={model.value}
                    formItemRenderMap={formItemRenderMap}
                    initRender={initRender}
                    formSchemaMap={formSchemaMap.value}
                    scopedSlots={slots}
                  ></TableRender>
                );
              },
            }}
          ></Form>
        );
    },
  });
  return [InnerTable] as [any];
}
