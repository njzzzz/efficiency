import {
  computed,
  defineComponent,
  ref,
  ComputedRef,
  useSlots,
  useListeners,
} from "vue";
import { FormRender } from "@slacking/form";
import { convertListToMap, isArray } from "@slacking/shared";
import { formProps } from "./formProps";
export function useForm() {
  const _formRef = ref();
  const formData = computed(() => _formRef.value?.model);
  const formRef = computed(() => _formRef.value?.elFormRef);
  const schema = computed(() => _formRef.value?.schema);
  const schemaOptionMaps = computed(() =>
    convertListToMap(
      schema.value?.list,
      { value: "prop", children: "list" },
      false
    )
  );
  /**
   * 需要在表单初始化完成后使用，否则返回undefined
   */
  function getFullValue(prop) {
    const originValue = formData.value?.[prop];
    const __optionsMap = schemaOptionMaps.value?.[prop]?.__optionsMap ?? {};
    return isArray(originValue)
      ? originValue.map((val) => __optionsMap[val])
      : __optionsMap[originValue];
  }
  const EffectForm = defineComponent({
    props: formProps,
    setup(props, { emit }) {
      const slots = useSlots();
      const listeners = useListeners();
      return () => {
        return (
          <FormRender
            ref={_formRef}
            props={props}
            scopedSlots={slots}
            on={{
              ...listeners,
              input($event) {
                emit("input", $event);
              },
            }}
          ></FormRender>
        );
      };
    },
  });
  return { Form: EffectForm, formData, formRef, schema, getFullValue } as {
    Form: any;
    formData: ComputedRef<any>;
    formRef: ComputedRef<any>;
    schema: ComputedRef<any>;
    getFullValue: (prop: string) => any;
  };
}
