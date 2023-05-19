import { computed, defineComponent, inject, reactive, ref } from "vue";
import { useForm, defineFormSchema, FormItemRender } from "@slacking/form";
import { Button, Cascader } from "element-ui";
import { useConfig } from "./config";
const { cascaderOptions } = useConfig();
const sleep = (res = [], timing = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res);
    }, timing);
  });
};

export default defineComponent({
  setup() {
    const { formModel = { value: {} } } = inject("TEST_FORM") as any;
    const schema = computed(() =>
      defineFormSchema({
        ...formModel.value,
        list: [
          {
            type: "Mix",
            list: [
              { type: "Input", prop: "x", label: "x" },
              {
                type: "Mix",
                list: [
                  { prop: "y", label: "y" },
                  { prop: "z", label: "z" },
                ],
              },
            ],
          },
        ],
      })
    );
    const { Form: EffectForm, formData, formRef, getFullValue } = useForm();
    const model = ref({
      age: 0,
      name: "",
    });

    const validate = () => {
      console.log(formData);
      formRef.value.validate();
    };

    return () => (
      <div>
        <EffectForm
          schema={schema.value}
          props={{
            model: model.value,
          }}
          onInput={(v) => {
            model.value = v;
            const fullValue = getFullValue("yz");
            console.log("【LOG】  fullValue ---->", fullValue);
          }}
          onUpdateSchema={(v) => {}}
          onValidate={(v) => {
            console.log(v);
          }}
        ></EffectForm>
        <Button onClick={validate} type="primary">
          提交
        </Button>
      </div>
    );
  },
});
