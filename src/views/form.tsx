import { defineComponent, reactive, ref } from "vue";
import { useForm, defineFormSchema } from "@slacking/form";
import { Button } from "element-ui";
import { useConfig } from "./config";
const { cascaderOptions } = useConfig();
const sleep = (res = [], timing = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res);
    }, timing);
  });
};
const schema = ref(
  defineFormSchema({
    name: "表单名称",
    readonly: false,
    disabled: false,
    coreVersion: "1.0",
    labelPosition: "top",
    labelWidth: "120px",
    autoOptionProps: true,
    size: "small", //medium / small / mini
    inline: false,
    gutter: 16,
    symbol: "：",
    withObjectValue: true, // 带options的表单项是否需要抛出完整的值以_${prop}为键名
    list: [
      {
        type: "Select",
        label: "Select",
        prop: "Select",
        required: true,
        optionProps: {
          value: "a",
          label: "b",
        },
        async asyncOptions() {
          const data = await sleep([
            { a: 1, b: 1 },
            { a: 2, b: 2 },
            { a: 3, b: 3 },
            { a: 4, b: 4 },
          ]);
          return data;
        },
      },
      {
        type: "Input",
        prop: "name",
        label: "姓名",
        minLen: 3,
        maxLen: 3,
        defaultValue: "xxx",
        // regexp: /[\s\S]*/,
        required: true,
        // trigger: ["change", "blur"],
        message: "请输入姓名",
        ons: {
          // 不要在此处监听change事件，因为在input的时候修改model不会触发此处的change
          blur(val, model, item, schema) {
            console.log("【LOG】  val ---->", val);
          },
        },
        // validator(rule, value, callback, item, model) {
        //   callback(new Error("请输入姓名"));
        // },
      },
      {
        type: "TimeSelect",
        prop: "TimeSelect",
        label: "TimeSelect",
        required: true,
      },
      {
        type: "SelectTree",
        prop: "SelectTree",
        label: "SelectTree",
        required: true,
        options: cascaderOptions,
        multiple: true,
      },
      {
        type: "DatePicker",
        prop: "DatePicker",
        label: "DatePicker",
        required: true,
      },
      {
        type: "DatePicker",
        prop: "DatePickerDateTimeRange",
        label: "DatePickerDateTimeRange",
        required: true,
        props: {
          type: "datetimerange",
        },
      },
      {
        type: "Slider",
        prop: "Slider",
        label: "Slider",
        required: true,
      },
      {
        type: "ColorPicker",
        prop: "ColorPicker",
        label: "ColorPicker",
        required: true,
      },
      {
        type: "Rate",
        prop: "Rate",
        label: "Rate",
        required: true,
      },
      {
        type: "Switch",
        prop: "Switch",
        label: "Switch",
        required: true,
      },
      {
        type: "Input",
        prop: "sex",
        label: "性别",
        dependOn: {
          name(val, model, item) {
            item.show = val === "xxx1";
          },
        },
      },
      {
        type: "Select",
        prop: "lover",
        label: "爱好",
        a: 1,
        b: 2,
        // async asyncOptions() {
        //   return [
        //     { value: "1", label: "吃" },
        //     { value: "2", label: "喝" },
        //     { value: "3", label: "玩" },
        //     { value: "4", label: "乐" },
        //   ];
        // },
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
        type: "InputNumber",
        prop: "age",
        label: "年龄",
        dependOn: {
          age(val, model, item, oldVal) {},
          name: {
            handler(val, model, item, oldVal) {
              const random = Math.random();
              model.value.sex = val;
              item.label = random.toString();
              item.type = random > 0.5 ? "InputNumber" : "Input";
            },
            immediate: false,
          },
        },
      },
      {
        type: "Input",
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
              model.value.sex = Math.random();
              item.show = Math.random() > 0.5;
            },
            immediate: false,
          },
        },
      },
      {
        type: "Cascader",
        label: "设计原则",
        prop: "yz",
        required: true,
        maxLen: 10,
        minLen: 2,
        multiple: true,
        options: cascaderOptions,
      },
      {
        type: "Mix",
        // align: "bottom",
        gutter: 16,
        justify: "start",
        label: "别名",
        required: true,
        prop: "otherName",
        // validator(_1, _2, callback) {
        //   callback(new Error(111));
        // },
        list: [
          {
            type: "Select",
            prop: "name1",
            span: 3,
            filterable: true,
            clearable: false,
            multiple: false,
            async asyncOptions() {
              return [
                { value: "1", label: "吃" },
                { value: "2", label: "喝" },
                { value: "3", label: "玩" },
                { value: "4", label: "乐" },
              ];
            },
          },
          {
            type: "Input",
            prop: "sex1",
            required: false,
            dependOn: {
              name1(val, model, item, oldVal) {
                item.show = val === "2";
              },
            },
          },
        ],
      },
      {
        type: "Mix",
        align: "bottom",
        gutter: 30,
        justify: "end",
        prop: "111",
        list: [
          {
            type: "Input",
            prop: "column1",
            label: "同一行-1",
            required: true,
          },
          {
            type: "Input",
            prop: "column2",
            label: "同一行-2",
            required: true,
          },
        ],
      },
    ],
  })
);

export default defineComponent({
  setup() {
    const [EffectForm, formData, formRef, _schema] = useForm();
    const [AnotherEffectForm, AnotherFormData, anotherFormRef, anotherSchema] =
      useForm();
    const model = ref({
      age: 0,
    });
    const modSchema = () => {
      schema.value.list[0].label = "111111";
    };
    const modFormData = () => {
      // model.value.name = "122";
    };
    const validate = () => {
      console.log(formData);
      formRef.value.validate();
    };
    return () => (
      <div>
        <Button onClick={modSchema}>修改schema</Button>
        <Button onClick={modFormData}>修改姓名</Button>
        <Button onClick={validate}>表单验证</Button>
        <EffectForm
          props={{ schema: schema.value, model }}
          onInput={(v) => {
            model.value = v;
          }}
          onUpdateSchema={(v) => {
            schema.value = v;
          }}
        ></EffectForm>
      </div>
    );
  },
});
