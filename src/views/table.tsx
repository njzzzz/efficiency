import { defineComponent } from "vue";
import { useTable } from "@slacking/table";
const columns = [
  {
    prop: "name",
    label: "姓名",
    sortable: true,
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "lover",
    label: "爱好",
  },
  {
    prop: "lover",
    label: "爱好",
  },
  {
    prop: "lover",
    label: "爱好",
  },
  {
    prop: "lover",
    label: "爱好",
  },
  {
    prop: "lover",
    label: "爱好",
  },
  {
    prop: "lover",
    label: "爱好1",
    scopedSlots: {
      default(item) {
        console.log("【LOG】  aa ---->", item);
        return <div>xxxx</div>;
      },
    },
  },
  {
    prop: "lover",
    label: "爱好",
  },
];
const data = [
  { name: "张三", age: 18, lover: "唱" },
  { name: "李四", age: 18, lover: "跳" },
  { name: "王五", age: 18, lover: "rap" },
  { name: "老六", age: 18, lover: "篮球" },
];
const model = [];

export default defineComponent({
  setup() {
    const [Table] = useTable();
    return () => (
      <Table columns={columns} data={data} style="width: 100%"></Table>
    );
  },
});
