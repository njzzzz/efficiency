import {
  ref,
  defineComponent,
  provide,
  toRefs,
  watch,
  useSlots,
  useListeners,
} from "vue";
import { useHandleInit, FormItemRender } from "@slacking/form";
import { renderComponent, mergeListeners } from "@slacking/shared";
import { formProps } from "./formProps";
import { cloneDeep } from "lodash-es";
export const globalProviderKey = Symbol();
export default defineComponent({
  props: formProps,
  setup(props, { expose, emit }) {
    const slots = useSlots();
    const listeners = useListeners();
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
    watch(
      () => model.value,
      (v) => {
        runtimeModel.value = v;
      },
      { deep: true, immediate: true }
    );
    watch(
      schema,
      (v) => {
        runtimeSchema.value = cloneDeep(v);
        init(
          runtimeSchema.value.list ?? [],
          runtimeModel,
          elFormRef,
          runtimeSchema
        );
      },
      { immediate: true }
    );
    watch(
      runtimeModel,
      (v) => {
        emit("input", v);
      },
      { deep: true }
    );
    watch(
      runtimeSchema,
      (v) => {
        emit("update-schema", v);
      },
      { deep: true }
    );
    expose({
      elFormRef,
      model: runtimeModel,
      schema: runtimeSchema,
    });

    return () => {
      return (
        <Form
          ref={elFormRef}
          props={{
            model: runtimeModel.value,
            ...runtimeSchema.value,
            hideRequiredAsterisk: false,
          }}
          scopedSlots={slots}
          on={mergeListeners(runtimeSchema.value.ons, listeners)}
        >
          {runtimeSchema.value.list?.map?.((item, index) => {
            return (
              <FormItemRender
                item={item}
                key={item?.prop || item?.list?.[0]?.prop || index}
              ></FormItemRender>
            );
          })}
        </Form>
      );
    };
  },
}) as any;
