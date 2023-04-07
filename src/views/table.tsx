import { defineComponent, ref, set } from "vue";
import {
  useTable,
  defineTableColumns,
  defineTableSchema,
} from "@slacking/table";
// element-ui 多级表头固定列bug，未修复前，需要保证子表头的width之和等于父表头的宽度
const _columns = defineTableColumns([
  {
    label: "姓名",
    fixed: true,
    sortable: true,
    width: 400,
    prop: "name",
    required: true,
    hideLabelText: false,
    subHeaders: [
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
        // showOverflowTooltip: false,
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
    width: 300,
    type: "Select",
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
  {
    prop: "lover-other",
    label: "其他爱好",
    width: 1000,
  },
  {
    prop: "lover",
    label: "爱好",
  },
]);
const _data = [
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
  { name: 1, age: "2" },
] as any;
export default defineComponent({
  setup() {
    const model = ref(_data);
    const [Table, formRef, tableModel] = useTable();
    const schema = ref(
      defineTableSchema({
        readonly: false,
        list: _columns,
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
