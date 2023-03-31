import {
  ref,
  defineComponent,
  provide,
  toRefs,
  watch,
  computed,
  onRenderTriggered,
  useSlots,
  useAttrs,
  set,
} from "vue";
import { useHandleInit } from "./useHandleInit";
import Mix from "../components/Mix";
import FormItem from "../components/FormItem";
import { renderComponent } from "@slacking/shared";
import { formProps } from "./formProps";
import { cloneDeep, isEqual } from "lodash-es";
import FormItemWithMix from "../components/FormItemWithMix";
export const globalProviderKey = Symbol();
export default defineComponent({
  props: formProps,
  setup(props, { expose, emit }) {
    const slots = useSlots();
    console.log("【LOG】  slot11111s ---->", slots);
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
    const subFormItemRenderMap = ref({});
    const FormItemWithMixRender = computed<any>(() => {
      return defineComponent({
        setup() {
          const attrs = useAttrs() as any;
          return () => (
            <FormItemWithMix
              item={attrs.item}
              key={attrs.item?.prop || attrs.item?.list?.[0]?.prop}
              scopedSlots={{
                render({ item, render }) {
                  console.log(
                    "【LOG】  item, render  ---->",
                    item.label,
                    render
                  );
                  if (item.prop) {
                    set(subFormItemRenderMap.value, item.prop, render);
                  }
                  return <render.value></render.value>;
                },
              }}
            ></FormItemWithMix>
          );
        },
      });
    });
    const formItemRenderMap = computed(() => {
      return runtimeSchema.value.list.reduce((acc, item) => {
        if (item.prop !== undefined) {
          acc[item.prop] = () => (
            <FormItemWithMixRender.value
              item={item}
            ></FormItemWithMixRender.value>
          );
        }
        return acc;
      }, {});
    });
    const totalFormItemRenderMap = computed(() => {
      return { ...subFormItemRenderMap.value, ...formItemRenderMap.value };
    });
    expose({
      elFormRef,
      model: runtimeModel,
      schema: runtimeSchema,
    });
    const initRender = () =>
      runtimeSchema.value.list.map((item) => {
        return (
          <FormItemWithMixRender.value
            item={item}
          ></FormItemWithMixRender.value>
        );
      });
    return () => {
      return (
        <Form
          ref={elFormRef}
          props={{ model: runtimeModel.value, ...runtimeSchema.value }}
          scopedSlots={slots}
        >
          {slots.render
            ? slots.render(initRender, totalFormItemRenderMap.value)
            : initRender()}
        </Form>
      );
    };
  },
}) as any;
