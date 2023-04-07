import {
  ref,
  defineComponent,
  provide,
  toRefs,
  watch,
  computed,
  useSlots,
  useAttrs,
  set,
} from "vue";
import { useHandleInit } from "./useHandleInit";
import { renderComponent } from "@slacking/shared";
import { formProps } from "./formProps";
import { cloneDeep } from "lodash-es";
import FormItemWithMix from "../components/FormItemWithMix";
import { useCollectFormItemRenderMap } from "./useCollectFormItemRenderMap";
export const globalProviderKey = Symbol();
export default defineComponent({
  props: formProps,
  setup(props, { expose, emit }) {
    const slots = useSlots();
    const elFormRef = ref();
    const Form = renderComponent("Form");
    const subFormItemRenderMap = ref({});
    const { model, schema } = toRefs(props);
    const runtimeModel = ref<any>({});
    const runtimeSchema = ref<any>({});
    const { init } = useHandleInit();
    const { getRenderMap } = useCollectFormItemRenderMap({ runtimeSchema });
    provide(globalProviderKey, {
      model: runtimeModel,
      schema: runtimeSchema,
      subFormItemRenderMap: subFormItemRenderMap,
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
    const genRenderMap = computed(() => runtimeSchema.value?.genRenderMap);
    expose({
      elFormRef,
      model: runtimeModel,
      schema: runtimeSchema,
    });
    return () => {
      return (
        <Form
          ref={elFormRef}
          props={{ model: runtimeModel.value, ...runtimeSchema.value }}
          scopedSlots={slots}
        >
          {slots.render
            ? slots.render(genRenderMap.value && getRenderMap())
            : runtimeSchema.value.list?.map?.((item, index) => {
                return (
                  <FormItemWithMix
                    item={item}
                    key={item?.prop || item?.list?.[0]?.prop || index}
                  ></FormItemWithMix>
                );
              })}
        </Form>
      );
    };
  },
}) as any;
