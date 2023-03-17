import { ref, defineComponent, provide, toRefs, watch } from "vue";
import { useHandleInit } from "./useHandleInit";
import Mix from "./components/Mix";
import FormItem from "./components/FormItem";
import { renderComponent } from "./useFormRegister";
import { formProps } from "./formProps";
import { cloneDeep, isEqual } from "lodash-es";
export const globalProviderKey = Symbol();
export default defineComponent({
  props: formProps,
  setup(props, { expose, emit }) {
    const initialing = ref(false);
    const elFormRef = ref();
    const Form = renderComponent("Form");
    const { model, schema } = toRefs(props);
    const runtimeModel = ref({});
    const runtimeSchema = ref({});
    const { init } = useHandleInit();
    provide(globalProviderKey, {
      model: runtimeModel,
      schema: runtimeSchema,
    });
    watch(
      model,
      (v) => {
        if (isEqual(v, runtimeModel.value)) return;
        runtimeModel.value = cloneDeep(v);
      },
      { deep: true, immediate: true }
    );
    watch(
      schema,
      (v) => {
        if (isEqual(v, runtimeSchema.value)) return;
        runtimeSchema.value = cloneDeep(v);
      },
      { deep: true, immediate: true }
    );
    watch(
      runtimeModel,
      (v) => {
        !initialing.value && emit("input", v);
      },
      { deep: true }
    );
    if (runtimeSchema.value?.list?.length) {
      initialing.value = true;
      init(runtimeSchema.value.list, runtimeModel);
      initialing.value = false;
    } else {
      return () => null;
    }
    expose({
      elFormRef,
      model: runtimeModel,
      schema: runtimeSchema,
    });
    return () => (
      <Form
        ref={elFormRef}
        props={{ model: runtimeModel.value, ...runtimeSchema.value }}
      >
        {runtimeSchema.value.list.map((item) => {
          if (item.type === "Mix") {
            return <Mix item={item}></Mix>;
          } else {
            return <FormItem item={item}></FormItem>;
          }
        })}
      </Form>
    );
  },
});
