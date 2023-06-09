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
            type: "Select",
            label: "Select",
            prop: "Select",
            required: true,
            defaultValue: 1,
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
            prop: "test-async-getFullValue",
            label: "getFullValue",
            dependOn: {
              Select({ getFullValue }) {
                const val = getFullValue("Select");
                console.log("【LOG】  1111121212121212 ---->", val);
              },
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
              blur(val, { model, item, schema }) {
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
              name({ val, model, item, schema, oldVal, getFullValue }) {
                console.log("【LOG】  getFullValue ---->", getFullValue);
                // item.show = val === "xxx1";
                console.log(11111, getFullValue("lover"));
              },
            },
          },
          {
            type: "Select",
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
                handler({ val, model, item, schema, oldVal, getFullValue }) {
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
              age({ val, model, item, schema, oldVal }) {},
              name: {
                handler({ val, model, item, schema, oldVal }) {
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
            options: cascaderOptions,
            required: true,
            scopedSlots: {
              // label({ dItem }) {
              //   return 111;
              // },
              default({ dItem }) {
                console.log("【LOG】  dItem ---->", dItem);
                return dItem.value.readonly ? (
                  "xxx"
                ) : (
                  <Cascader
                    {...{ attrs: dItem.value }}
                    on={dItem.value.on}
                  ></Cascader>
                );
              },
            },
            dependOn: {
              name: {
                handler({ val, model, item, schema, oldVal }) {
                  console.log(
                    "【LOG】  val, model, item, oldVal ---->",
                    val,
                    model,
                    item,
                    oldVal,
                    schema
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
            defaultValue: ["jiaohu"],
            options: cascaderOptions,
          },
          {
            type: "Mix",
            // align: "bottom",
            gutter: 16,
            justify: "start",
            label: "别名",
            required: true,
            list: [
              {
                type: "Select",
                prop: "name1",
                span: 3,
                filterable: true,
                clearable: false,
                multiple: false,
                required: true,
                message: "请选择xxx",
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
                required: true,
                message: "请填写sex1",
                dependOn: {
                  name1({ val, model, item, schema, oldVal }) {
                    // item.show = val === "2";
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
                hideRequiredAsterisk: false,
              },
            ],
          },
          {
            type: "Mix",
            list: [
              {
                type: "Mix",
                label: "222",
                required: true,
                list: [
                  {
                    prop: "x",
                    required: true,
                    deleteValueOnDependOnChange: true,
                    dependOn: {
                      y({ val, updateValue }) {
                        updateValue(val);
                      },
                    },
                  },
                  {
                    prop: "y",
                    required: true,
                  },
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
