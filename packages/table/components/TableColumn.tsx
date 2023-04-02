import { computed, defineComponent, useAttrs, useSlots } from "vue";
import { renderComponent } from "@slacking/shared";
const TableColumn = renderComponent("TableColumn");
const InnerTableColumn = defineComponent({
  setup() {
    const attrs = useAttrs();
    const slots = useSlots();
    const subHeaders = computed(() => (attrs?.subHeaders as any) ?? []);
    const genCommonSlots = (column, subIndex = null) => {
      // 本身配置了插槽则使用自身插槽
      if (attrs.scopedSlots) {
        return attrs.scopedSlots;
      }
      // 多级表头嵌套多级表头，只会渲染最后一个多级表头，故这里
      if (column.subHeaders?.length) {
        return slots;
      }
      return {
        ...slots,
        default(...reset) {
          // 多级表头会传递多层，只取最后一个参数（默认插槽的参数）
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
