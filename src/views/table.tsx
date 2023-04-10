import { defineComponent, ref } from "vue";
import {
  useTable,
  defineTableColumns,
  defineTableSchema,
  genRuntimeFormProp,
} from "@slacking/table";
import { TableColumn, Form, FormItem } from "element-ui";
// element-ui 多级表头固定列bug，未修复前，需要保证子表头的width之和等于父表头的宽度
const _columns = defineTableColumns([
  {
    label: "姓名",
    fixed: true,
    sortable: true,
    width: 400,
    required: true,
    hideLabelText: false,
    subHeaders: [
      // {
      //   type: "expand",
      //   scopedSlots: {
      //     default() {
      //       return "someExpandSlot";
      //     },
      //   },
      // },
      {
        prop: "name-1",
        label: "姓名-1",
        width: 200,
        required: true,
        type: "Select",
        options: [
          { value: "1", label: "吃" },
          { value: "2", label: "喝" },
          { value: "3", label: "玩" },
          { value: "4", label: "乐" },
        ],
      },
      {
        prop: "name-2",
        label: "姓名-2",
        required: true,
        defaultValue: 1111,
        width: 200,
        ons: {
          input(val, a) {
            console.log("out input args", val, a);
          },
        },
      },
    ],
  },
  {
    prop: "age",
    label: "年龄",
    type: "Select",
    className: "xx",
    width: 200,
    options: [
      { value: "1", label: "吃" },
      { value: "2", label: "喝" },
      { value: "3", label: "玩" },
      { value: "4", label: "乐" },
    ],
  },
  {
    prop: "lovers",
    label: "爱好",
    width: 500,
    list: [
      { label: "第一个爱好", prop: "lovers-1" },
      { label: "第二个爱好", prop: "lovers-2" },
    ],
  },
  {
    prop: "lover",
    label: "爱好",
    width: 500,
    dependOn: {
      age() {},
    },
  },
  {
    prop: "lover",
    label: "爱好",
    width: 500,
  },
  {
    prop: "lover",
    label: "爱好",
    width: 500,
  },

  {
    prop: "lover",
    label: "爱好",
    minWidth: 200,
    // scopedSlots: {
    //   default(item) {
    //     return <div>xxxx</div>;
    //   },
    // },
  },
]);
const _data = [
  {
    id: 1,
    age: "2",
    "lover-other": "lover-other",
    lover: "lover",
    children: [
      {
        id: "sub-1",
        age: "4",
      },
      {
        id: "sub-2",
        age: "3",
      },
    ],
  },
  {
    id: 2,
    age: "2",
    "lover-other": "lover-other",
    lover: "lover",
    children: [
      {
        id: "sub-2-1",
        age: "4",
      },
      {
        id: "sub-2-2",
        age: "3",
      },
    ],
  },
  {
    id: 3,
    age: "2",
    "lover-other": "lover-other",
    lover: "lover",
    children: [
      {
        id: "sub-3-1",
        age: "4",
      },
      {
        id: "sub-3-2",
        age: "3",
      },
    ],
  },
  {
    id: 4,
    age: "2",
    "lover-other": "lover-other",
    lover: "lover",
    children: [
      {
        id: "sub-4-1",
        age: "4",
      },
      {
        id: "sub-4-2",
        age: "3",
      },
    ],
  },
] as any;
export default defineComponent({
  components: { TableColumn, Form, FormItem },
  setup() {
    const model = ref(_data);
    const [Table, formRef, tableModel] = useTable();
    const schema = ref(
      defineTableSchema({
        readonly: false,
        list: _columns,
        rowKey: "id",
        showOverflowTooltip: false,
      })
    );
    const click = () => {
      formRef.value.validate();
      // model.value = [
      //   { name: 1, age: "2" },
      //   { name: 1, age: "2" },
      //   { name: 1, age: "2" },
      //   { name: 1, age: "2" },
      //   { name: 1, age: "2" },
      //   { name: 1, age: "2" },
      //   { name: 1, age: "2" },
      //   { name: 1, age: "2" },
      //   { name: 1, age: "2" },
      //   { name: 1, age: "2" },
      //   { name: 1, age: "2" },
      // ];
    };

    return () => (
      <div>
        <div onClick={click}>表单验证</div>
        <Table
          props={{
            model: model.value,
          }}
          schema={schema.value}
          style="width: 100%"
        ></Table>
      </div>
    );
  },
});
