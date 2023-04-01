import { computed, defineComponent, useAttrs, useSlots } from "vue";
import { renderComponent } from "@slacking/shared";
const TableColumn = renderComponent("TableColumn");
const InnerTableColumn = defineComponent({
  setup() {
    const attrs = useAttrs();
    const slots = useSlots();
    const subHeaders = computed(() => (attrs?.list as any) ?? []);
    const genCommonSlots = (column, subIndex = null) => {
      // 多级表头嵌套多级表头，只会渲染最后一个多级表头
      if (column.list?.length) {
        return slots;
      }
      return {
        ...slots,
        default(...reset) {
          const args = reset.at(-1);
          return slots.default(
            {
              column,
              subIndex,
            },
            args
          );
        },
      };
    };
    return () => (
      <TableColumn
        attrs={{
          showOverflowTooltip: true,
          ...attrs,
        }}
        scopedSlots={genCommonSlots(attrs)}
      >
        {subHeaders.value.map((item, index) => {
          return (
            <InnerTableColumn
              {...{
                attrs: item,
              }}
              scopedSlots={genCommonSlots(item, index)}
            ></InnerTableColumn>
          );
        })}
      </TableColumn>
    );
  },
}) as any;
export default InnerTableColumn;
