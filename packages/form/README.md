### @slacking/form

配置式表单，支持自定义注册表单组件，单个组件支持自定义 disabled, readonly，和正常状态下的展示组件，目前支持 vue2  
支持 typescript，暂时只做代码提示用，具体参数含义可进类型定义文件看  
注意：设置 inline 等造成的样式问题，需要自己覆盖样式；首次渲染就触发了表单验证，请查看表单默认值类型是否准确，如 element-ui, select 组件在多选的时候如过没有传入数组，会导致一次值更新而触发表单验证

### 使用方式

#### 一、安装

```bash
npm i @slacking/form
yarn add @slacking/form
```

#### 二、注册组件

一般在入口文件中做全局注册，注册时必须提供 Form、FormItem、Row、Col 为了兼容不同的组件库  
默认配置的属性都会被传入表单项中， 自定义的表单项需要抛出 input 事件以更新表单 model 值

```js
import {
  Input,
  InputNumber,
  Radio,
  Form,
  FormItem,
  Row,
  Col,
  Table,
  TableColumn,
} from "element-ui";
import ReadonlySelect from "@/components/ReadonlySelect.vue";
import DisabledSelect from "@/components/DisabledSelect.vue";
import { useFormRegister } from "@slacking/form";
const { registerComponents } = useFormRegister();

registerComponents([
  { name: "Input", component: Input },
  { name: "InputNumber", component: InputNumber },
  { name: "Radio", component: Radio },
  {
    name: "Select",
    component: Select,
    disabledComponent: DisabledSelect,
    readonlyComponent: ReadonlySelect,
  },
  // 以下name不可以修改, 且必须提供
  { name: "Form", component: Form },
  { name: "FormItem", component: FormItem },
  { name: "Row", component: Row },
  { name: "Col", component: Col },
]);
```

### 三、使用 Form 组件

```jsx
import { defineComponent, reactive, ref, watch } from "vue";
import { Button } from "element-ui";
import { defineFormSchema, useForm } from "@slacking/form";
const schema = reactive(
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
    list: [
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
        // validator(rule, value, callback, item, model) {
        //   callback(new Error("请输入姓名"));
        // },
      },
      { type: "Input", prop: "sex", label: "性别" },
      {
        type: "Select",
        prop: "lover",
        label: "爱好",
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
              console.log(val, model, item, oldVal);
              model.value.sex = val;
              item.show = Math.random() > 0.5;
            },
            immediate: false,
          },
        },
      },
      {
        type: "Mix",
        gutter: 16,
        justify: "start",
        label: "别名",
        required: true,
        prop: "otherName",
        list: [
          {
            type: "Select",
            prop: "name1",
            span: 3,
            defaultValue: [],
            filterable: true,
            clearable: false,
            multiple: true,
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
            type: "AnyInput",
            prop: "sex1",
            required: false,
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
            type: "AnyInput",
            prop: "column1",
            label: "同一行-1",
            required: true,
          },
          {
            type: "AnyInput",
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
    // formData为表单值，在开启independent模式下不会修改model和schema，提交请使用formData和schema
    const [EffectForm, formData, formRef, schema] = useForm();
    const model = ref({
      age: 0,
    });
    const modSchema = () => {
      schema.list[0].label = "111111";
    };
    const validate = () => {
      formRef.value.validate();
    };
    return () => (
      <div>
        <Button onClick={modSchema}>修改schema</Button>
        <Button onClick={validate}>表单验证</Button>
        <EffectForm props={{ schema, model }}></EffectForm>
      </div>
    );
  },
});
```

### 兼容性

支持到 es6(es2015)，需要支持更旧的浏览器，请 include 到项目环境中编译  
如 vue-cli

```js
{
  transpileDependencies: ["@slacking/form"];
}
```

### 快速使用内置的 element-ui 注册组件

```js
import { elementUiRegister } from "@slacking/adapter";
elementUiRegister();

// 相当于注册了以下类型组件
registerComponents([
  { name: "Input", component: Input },
  { name: "InputNumber", component: InputNumber },
  { name: "Radio", component: Radio },
  { name: "Select", component: Select },
  { name: "Cascader", component: Cascader },
  { name: "SelectTree", component: SelectTree },
  { name: "TimeSelect", component: TimeSelect },
  { name: "DatePicker", component: DatePicker },
  { name: "Switch", component: Switch },
  { name: "Slider", component: Slider },
  { name: "Rate", component: Rate },
  { name: "ColorPicker", component: ColorPicker },
  { name: "Form", component: Form },
  { name: "FormItem", component: FormItem },
  { name: "Row", component: Row },
  { name: "Col", component: Col },
]);
```
