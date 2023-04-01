import { defineComponent, ref } from "vue";
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
    width: 1500,
    list: [
      {
        prop: "name",
        label: "姓名-1",
        defaultValue: 1111,
        // showOverflowTooltip: false,
        width: 300,
        scopedSlots: {
          default() {
            return (
              <span>
                是的舒服是的是的是谁的是谁的是谁说是的舒服是的是的是谁的是谁的是谁说是的舒服是的是的是谁的是谁的是谁说
              </span>
            );
          },
        },
      },
      {
        prop: "name",
        label: "姓名-2",
        defaultValue: 1111,
        // showOverflowTooltip: false,
        width: 300,
        scopedSlots: {
          default() {
            return (
              <span>
                是的舒服是的是的是谁的是谁的是谁说是的舒服是的是的是谁的是谁的是谁说是的舒服是的是的是谁的是谁的是谁说
              </span>
            );
          },
        },
      },
      {
        label: "姓名-3",
        width: 600,
        required: true,
        list: [
          {
            prop: "name",
            label: "姓名3-1",
            width: 300,
            defaultValue: 11,
            required: false,
          },
          {
            prop: "name",
            label: "姓名3-2",
            width: 300,
            list: [
              {
                prop: "name3-2-1",
                label: "姓名3-2-1",
                width: 300,
                defaultValue: 11,
                required: true,
              },
              {
                prop: "name3-2-2",
                label: "姓名3-2-2",
                width: 300,
                defaultValue: 11,
                required: true,
              },
            ],
          },
        ],
      },
      {
        prop: "name",
        label: "姓名-4",
        width: 300,
      },
    ],
  },
  {
    prop: "age",
    label: "年龄",
    width: 300,
  },
  // {
  //   prop: "lover",
  //   label: "爱好",
  //   width: 500,
  // },
  // {
  //   prop: "lover",
  //   label: "爱好",
  //   width: 500,
  // },
  // {
  //   prop: "lover",
  //   label: "爱好",
  //   width: 500,
  // },
  // {
  //   prop: "lover",
  //   label: "爱好",
  //   width: 500,
  // },
  // {
  //   prop: "lover",
  //   label: "爱好",
  // },
  {
    prop: "lover",
    label: "爱好",
    minWidth: 200,
    scopedSlots: {
      default(item) {
        return <div>xxxx</div>;
      },
    },
  },
  {
    prop: "lover",
    label: "其他爱好",
    width: 1000,
  },
  // {
  //   prop: "lover",
  //   label: "爱好",
  // },
]);
const _data = [
  { name: "张三", age: 18, lover: "唱" },
  { name: "李四", age: 18, lover: "跳" },
  { name: "王五", age: 18, lover: "rap" },
  { name: "老六", age: 18, lover: "篮球" },
];
export default defineComponent({
  setup() {
    const model = ref(_data);
    const [Table] = useTable();
    const schema = ref(
      defineTableSchema({
        readonly: false,
        labelPosition: "top",
        list: _columns,
      })
    );

    return () => (
      <Table
        props={{
          model: model.value,
        }}
        schema={schema.value}
        style="width: 100%"
      ></Table>
    );
  },
});
