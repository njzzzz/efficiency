import { defineComponent, useAttrs } from "vue";
import { renderComponent } from "../form/useFormRegister";
export default defineComponent({
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const attrs = useAttrs();
    const Table = renderComponent("Table");
    const TableColumn = renderComponent("TableColumn");
    return () => <Table columns={props.columns}></Table>;
  },
}) as any;
