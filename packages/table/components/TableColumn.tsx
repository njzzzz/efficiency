import { computed, defineComponent, useAttrs, useSlots } from "vue";
import {
  getGlobalTableConfig,
  getNotUndefinedValueByOrder,
  renderComponent,
  useOverrideProps,
} from "@slacking/shared";
const TableColumn = renderComponent("TableColumn");
const OriginFormItem = renderComponent("FormItem");
const InnerTableColumn = defineComponent({
  setup() {
    const slots = useSlots();
    const { runtimeAttrs, attrs } = useOverrideProps();
    const subHeaders = computed(() => (attrs?.subHeaders as any) ?? []);
    const genCommonSlots = (column, subIndex = null) => {
      // 本身配置了插槽则使用自身插槽
      if (attrs.scopedSlots) {
        return attrs.scopedSlots;
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
        header() {
          if (column.subHeaders) {
            return (
              <OriginFormItem
                class="slacking-form-asterisk-header"
                label={column.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginBottom: 0,
                  verticalAlign: "middle",
                }}
              ></OriginFormItem>
            );
          }
          const hideHeaderRequiredAsterisk = getNotUndefinedValueByOrder([
            column.hideHeaderRequiredAsterisk,
            (attrs.formSchema as any)?.hideHeaderRequiredAsterisk,
            false,
          ]);
          return hideHeaderRequiredAsterisk ? (
            column.label
          ) : (
            <OriginFormItem
              class="slacking-form-asterisk-header"
              label={column.label}
              required={column.required}
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginBottom: 0,
                verticalAlign: "middle",
              }}
            ></OriginFormItem>
          );
        },
      };
    };
    // scopedSlots={genCommonSlots(attrs)}
    const showOverflowTooltip = computed(() =>
      getNotUndefinedValueByOrder([
        attrs.showOverflowTooltip,
        (attrs.formSchema as any)?.showOverflowTooltip,
        getGlobalTableConfig().showOverflowTooltip,
        false,
      ])
    );
    const dynamicSlots = computed(() => {
      return runtimeAttrs.value.type === "selection"
        ? {}
        : { scopedSlots: genCommonSlots(attrs) };
    });
    return () => (
      <TableColumn
        attrs={{
          showOverflowTooltip: showOverflowTooltip.value,
          ...runtimeAttrs.value,
        }}
        {...dynamicSlots.value}
      >
        {subHeaders.value.map((item, index) => {
          return (
            <InnerTableColumn
              {...{ attrs: { ...item, formSchema: attrs.formSchema } }}
              key={item.prop || item.columnIndex}
              scopedSlots={genCommonSlots(item, index)}
            ></InnerTableColumn>
          );
        })}
      </TableColumn>
    );
  },
}) as any;
export default InnerTableColumn;
