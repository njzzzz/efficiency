import {
  computed,
  defineComponent,
  ref,
  ComputedRef,
  useSlots,
  useListeners,
} from "vue";
import { FormRender } from "@slacking/form";
import { formProps } from "./formProps";
export function useForm() {
  const _formRef = ref();
  const formData = computed(() => _formRef.value?.model);
  const formRef = computed(() => _formRef.value?.elFormRef);
  const schema = computed(() => _formRef.value?.schema);
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
  return { Form: EffectForm, formData, formRef, schema } as {
    Form: any;
    formData: ComputedRef<any>;
    formRef: ComputedRef<any>;
    schema: ComputedRef<any>;
  };
}
