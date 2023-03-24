import { defineComponent, reactive, ref, watch } from "vue";
import { useForm } from "@/components/form/useForm";
import { Button } from "element-ui";
import { defineFormSchema } from "@/components";
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
    withObjectValue: true, // 带options的表单项是否需要抛出完整的值以_${prop}为键名
    independent: true, // 是否深克隆model和schema，这样会使相同引用数据的form互不影响
    list: [
      {
        type: "AnyInput",
        prop: "name",
        label: "姓名",
        minLength: 3,
        // maxLength: 3,
        defaultValue: "xxx",
        // regexp: /[\s\S]*/,
        required: true,
        // trigger: ["change", "blur"],
        message: "请输入姓名",
        // validator(rule, value, callback, item, model) {
        //   callback(new Error("请输入姓名"));
        // },
      },
      {
        type: "AnyInput",
        prop: "sex",
        label: "性别",
        dependOn: {
          name(val, model, item) {
            item.show = val === "xxx1";
          },
        },
      },
      {
        type: "AnySelect",
        prop: "lover",
        label: "爱好",
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
              model.value.sex = Math.random();
              item.show = Math.random() > 0.5;
            },
            immediate: false,
          },
        },
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
            type: "AnySelect",
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
            type: "AnyInput",
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
    const [EffectForm, formData, formRef, _schema] = useForm();
    const [AnotherEffectForm, AnotherFormData, anotherFormRef, anotherSchema] =
      useForm();
    const model = ref({
      age: 0,
    });
    const modSchema = () => {
      schema.list[0].label = "111111";
    };
    return () => (
      <div>
        <Button onClick={modSchema}>修改schema</Button>
        <EffectForm props={{ schema, model: model }}></EffectForm>
        {/* <AnotherEffectForm props={{ schema, model: model }}></AnotherEffectForm> */}
      </div>
    );
  },
});
