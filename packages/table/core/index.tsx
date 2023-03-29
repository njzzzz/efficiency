import { defineComponent, useAttrs } from "vue";
import { renderComponent } from "@slacking/shared";
import TableColumn from "../components/TableColumn";
export function useTable() {
  const Table = renderComponent("Table");
  const InnerTable = defineComponent({
    setup() {
      const attrs = useAttrs() as any;
      return () => (
        <Table {...{ attrs }} scopedSlots={attrs.scopedSlots}>
          {attrs?.columns?.length &&
            attrs.columns.map((item) => {
              return <TableColumn {...{ attrs: item }}></TableColumn>;
            })}
        </Table>
      );
    },
  });
  return [InnerTable] as [any];
}
