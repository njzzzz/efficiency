import { defineComponent, useAttrs } from "vue";
import { renderComponent } from "@slacking/shared";
const TableColumn = renderComponent("TableColumn");
export default defineComponent({
  setup() {
    const attrs = useAttrs();
    return () => (
      <TableColumn
        {...{ attrs: { showOverflowTooltip: true, ...attrs } }}
        scopedSlots={attrs.scopedSlots}
      ></TableColumn>
    );
  },
}) as any;
