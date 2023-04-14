import { defineComponent, ref, set } from "vue";
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
        prop: "name-0",
        label: "姓名0",
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
        prop: "name-1",
        label: "姓名-1",
        required: true,
        defaultValue: 1111,
        readonlyFormatter() {
          return 2222222;
        },
        width: 200,
      },
    ],
  },
  {
    prop: "age2",
    label: "年龄2",
    type: "Select",
    width: 200,
    options: [
      { value: "1", label: "吃" },
      { value: "2", label: "喝" },
      { value: "3", label: "玩" },
      { value: "4", label: "乐" },
    ],
  },
  {
    label: "爱好3",
    width: 500,
    type: "Mix",
    list: [
      { label: "第一个爱好", prop: "lovers-1" },
      { label: "第二个爱好", prop: "lovers-2" },
    ],
  },
  {
    label: "爱好4",
    width: 500,
    prop: "lover4",
    type: "Mix",
    list: [
      { label: "第一个爱好", prop: "lovers-4-1" },
      { label: "第二个爱好", prop: "lovers-4-2" },
    ],
  },
  {
    prop: "lover5",
    label: "爱好5",
    width: 500,
  },
  {
    prop: "lover6",
    label: "爱好6",
    width: 500,
  },
  {
    prop: "lover7",
    label: "爱好7",
    width: 500,
  },
  {
    prop: "lover8",
    label: "爱好8",
    minWidth: 200,
    required: true,
    // scopedSlots: {
    //   default(item) {
    //     return <div>xxxx</div>;
    //   },
    // },
  },
]);
const _data = [
  {
    id: "0",
    age2: "1",
    children: [
      {
        id: "sub0-0",
      },
      {
        id: "sub0-1",
      },
    ],
  },

  {
    id: 2,
    children: [
      {
        id: "sub-2-1",
      },
      {
        id: "sub-2-2",
      },
    ],
  },
  {
    id: 3,
    children: [
      {
        id: "sub-3-1",
      },
      {
        id: "sub-3-2",
      },
    ],
  },
  {
    id: 4,
    children: [
      {
        id: "sub-4-1",
      },
      {
        id: "sub-4-2",
      },
    ],
  },
] as any;
export default defineComponent({
  components: { TableColumn, Form, FormItem },
  setup() {
    const model = ref(_data);
    const [Table, formRef] = useTable();
    const schema = ref(
      defineTableSchema({
        readonly: false,
        list: _columns,
        rowKey: "id",
        showOverflowTooltip: true,
        hideHeaderRequiredAsterisk: true,
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
