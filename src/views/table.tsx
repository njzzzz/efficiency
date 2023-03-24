import { defineComponent } from "vue";
import Table from "@/components/table";
const columns = [
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
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
    return () => <Table columns={columns} data={data}></Table>;
  },
});
