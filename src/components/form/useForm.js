import { computed, defineComponent, ref } from "vue";
import Form from "./";
import { formProps } from "./formProps";
export function useForm() {
  const _formRef = ref();
  const formData = computed(() => _formRef.value?.model);
  const formRef = computed(() => _formRef.value?.elFormRef);
  const schema = computed(() => _formRef.value?.schema);
  const EffectForm = defineComponent({
    props: formProps,
    setup(props, { emit }) {
      return () => (
        <Form
          ref={_formRef}
          props={props}
          onInput={($event) => emit("input", $event)}
        ></Form>
      );
    },
  });
  return [EffectForm, formData, formRef, schema];
}
