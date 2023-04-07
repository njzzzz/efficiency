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
    width: 200,
    prop: "name",
    required: true,

    // subHeaders: [
    //   {
    //     prop: "name-1",
    //     label: "姓名-1",
    //     defaultValue: 1111,
    //     // showOverflowTooltip: false,
    //     width: 100,
    //     ons: {
    //       input(val, a) {
    //         console.log("out input args", val, a);
    //       },
    //     },
    //     // scopedSlots: {
    //     //   default() {
    //     //     return (
    //     //       <span>
    //     //         是的舒服是的是的是谁的是谁的是谁说是的舒服是的是的是谁的是谁的是谁说是的舒服是的是的是谁的是谁的是谁说
    //     //       </span>
    //     //     );
    //     //   },
    //     // },
    //   },
    //   {
    //     prop: "name-2",
    //     label: "姓名-2",
    //     defaultValue: 1111,
    //     // showOverflowTooltip: false,
    //     width: 100,
    //     scopedSlots: {
    //       default(...args) {
    //         return (
    //           <span>
    //             是的舒服是的是的是谁的是谁的是谁说是的舒服是的是的是谁的是谁的是谁说是的舒服是的是的是谁的是谁的是谁说
    //           </span>
    //         );
    //       },
    //     },
    //   },
    //   {
    //     label: "姓名-3",
    //     width: 500,
    //     required: true,
    //     subHeaders: [
    //       {
    //         prop: "name3-1",
    //         label: "姓名3-1",
    //         width: 100,
    //         defaultValue: 11,
    //         required: false,
    //         scopedSlots: {
    //           default() {
    //             return (
    //               <span>
    //                 是的舒服是的是的是谁的是谁的是谁说是的舒服是的是的是谁的是谁的是谁说是的舒服是的是的是谁的是谁的是谁说
    //               </span>
    //             );
    //           },
    //         },
    //       },
    //       {
    //         label: "姓名3-2",
    //         width: 400,
    //         gap: "50px",
    //         list: [
    //           {
    //             prop: "name3-2-1",
    //             label: "姓名3-2-1",
    //             defaultValue: 11,
    //             required: true,
    //           },
    //           {
    //             prop: "name3-2-2",
    //             label: "姓名3-2-2",
    //             defaultValue: 11,
    //             required: true,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     prop: "name-4",
    //     label: "姓名-4",
    //     width: 100,
    //   },
    // ],
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
        labelPosition: "left",
        list: _columns,
        hideLabelText: true,
        hideRequiredAsterisk: false,
      })
    );
    const click = () => {
      model.value = [
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
      ];
    };

    return () => (
      <div>
        <div onClick={click}>{model.value.length}</div>
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
