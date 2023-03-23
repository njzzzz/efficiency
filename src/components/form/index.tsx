import {
  ref,
  defineComponent,
  provide,
  toRefs,
  watch,
  computed,
  onRenderTriggered,
} from "vue";
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
    const runtimeModel = ref<any>({});
    const runtimeSchema = ref<any>({});
    const { init } = useHandleInit();
    provide(globalProviderKey, {
      model: runtimeModel,
      schema: runtimeSchema,
    });
    const isIndependentForm = computed(
      () => schema.value?.independent === true
    );
    //---------dev---------------------------------
    onRenderTriggered((e) => {
      console.log("elFrom onRenderTriggered", e);
    });
    console.count("elFrom setup render-times");
    //---------dev---------------------------------
    watch(
      model,
      (v) => {
        if (isEqual(v, runtimeModel.value)) return;
        runtimeModel.value = isIndependentForm.value ? cloneDeep(v) : v;
      },
      { deep: true, immediate: true }
    );
    watch(
      schema,
      (v) => {
        if (isEqual(v, runtimeSchema.value)) return;
        runtimeSchema.value = isIndependentForm.value ? cloneDeep(v) : v;
        initialing.value = true;
        init(runtimeSchema.value.list, runtimeModel, elFormRef, runtimeSchema);
        initialing.value = false;
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
    if (!runtimeSchema.value?.list?.length) {
      return () => null;
    }
    expose({
      elFormRef,
      model: runtimeModel,
      schema: runtimeSchema,
    });
    return () => {
      console.count("ElForm render-times");
      return (
        <Form
          ref={elFormRef}
          props={{ model: runtimeModel.value, ...runtimeSchema.value }}
        >
          {runtimeSchema.value.list.map((item) => {
            if (item.type === "Mix") {
              return (
                <Mix item={item} key={item.prop || item.list[0].prop}></Mix>
              );
            } else {
              return <FormItem item={item} key={item.prop}></FormItem>;
            }
          })}
        </Form>
      );
    };
  },
}) as any;
