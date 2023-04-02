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
        {/* 此处触发表单渲染，之后在表单中做prop和相应render的收集 */}
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
                    const dataIndex = realData.$index;
                    const { schemaIndex = null, subDeep = null } =
                      realColumn.__prop ?? {};
                    // schemaIndex 都一样直接获取第一个就行
                    const virtualProp = genVirtualProp({
                      config: realColumn,
                      dataIndex,
                      schemaIndex,
                      subDeep,
                      subIndex,
                      changeConfig: false,
                    });
                    // 获取到每一项表单的render在此处渲染
                    const Render = attrs.formItemRenderMap[virtualProp];
                    console.log(attrs.formItemRenderMap, virtualProp, Render);

                    return <Render></Render>;
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
