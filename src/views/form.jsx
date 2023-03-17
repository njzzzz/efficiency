import { defineComponent, reactive, ref, watch } from "vue";
import { useForm } from "@/components/form/useForm";
const schema = reactive({
  name: "表单名称",
  readonly: false,
  disabled: false,
  coreVersion: "1.0",
  labelPosition: "top",
  labelWidth: "120px",
  size: "small", //medium / small / mini
  inline: false,
  gutter: 16,
  symbol: ":",
  withObjectValue: false,
  list: [
    {
      type: "AnyInput",
      prop: "name",
      label: "姓名",
      defaultValue: "xxx",
      // regexp: /[\s\S]*/,
      required: true,
      // trigger: ["change", "blur"],
      message: "请输入姓名",
      // validator(rule, value, callback, item, model) {
      //   callback(new Error("请输入姓名"));
      // },
    },
    { type: "AnyInput", prop: "sex", label: "性别" },
    {
      type: "AnySelect",
      prop: "lover",
      label: "爱好",
      async asyncOptions() {
        return [
          { value: "1", label: "吃" },
          { value: "2", label: "喝" },
          { value: "3", label: "玩" },
          { value: "4", label: "乐" },
        ];
      },
      dependOn: {
        name: {
          handler(val, model, item, oldVal) {
            item.options = [
              { value: "1", label: val },
              { value: "2", label: "喝" },
              { value: "3", label: "玩" },
              { value: "4", label: "乐" },
            ];
            model.value.lover = "1";
          },
          immediate: false,
        },
      },
    },
    {
      type: "AnyInputNumber",
      prop: "age",
      label: "年龄",
      dependOn: {
        age(val, model, item, oldVal) {},
        name: {
          handler(val, model, item, oldVal) {
            const random = Math.random();
            model.value.sex = val;
            item.label = random.toString();
            item.type = random > 0.5 ? "AnyInputNumber" : "AnyInput";
          },
          immediate: false,
        },
      },
    },
    {
      type: "AnyInput",
      prop: "remark",
      label: "备注",
      dependOn: {
        name: {
          handler(val, model, item, oldVal) {
            console.log(
              "【LOG】  val, model, item, oldVal ---->",
              val,
              model,
              item,
              oldVal
            );
            model.value.sex = val;
            item.show = Math.random() > 0.5;
          },
          immediate: false,
        },
      },
    },
    {
      type: "Mix",
      align: "bottom",
      gutter: 30,
      justify: "end",
      label: "姓名_1",
      list: [
        { type: "AnyInput", prop: "name1", span: 6 },
        { type: "AnyInput", prop: "sex1" },
        { type: "AnyInput", prop: "sex2" },
      ],
    },
  ],
});

export default defineComponent({
  setup() {
    const [EffectForm, formData, formRef, _schema] = useForm();
    const [AnotherEffectForm, AnotherFormData, anotherFormRef, anotherSchema] =
      useForm();
    const model = ref({
      age: 0,
    });

    return () => (
      <div>
        <EffectForm props={{ schema, model: model }}></EffectForm>
        <AnotherEffectForm props={{ schema, model: model }}></AnotherEffectForm>
      </div>
    );
  },
});
