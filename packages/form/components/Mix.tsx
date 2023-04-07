import { computed, defineComponent, inject, toRefs, set } from "vue";
import { globalProviderKey } from "../core";
import { useConfig } from "../core/useConfig";
import { renderComponent } from "@slacking/shared";
import FormItemWithMix from "./FormItemWithMix";
const Mix = defineComponent({
  name: "mix",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { item } = toRefs(props);
    const { schema } = inject(globalProviderKey) as any;
    const { label } = useConfig({ item, schema });
    const Row = renderComponent("Row");
    const Col = renderComponent("Col");
    const OriginFormItem = renderComponent("FormItem");
    const noSpan = computed(() =>
      item.value.list.filter((item) => item.span === void 0)
    );
    const totalSpan = computed(() =>
      item.value.list.reduce((acc, item) => {
        acc += item.span || 0;
        return acc;
      }, 0)
    );
    const getSpan = (span) => {
      const noSpanLen = noSpan.value.length;
      return span
        ? span
        : totalSpan.value
        ? (24 - totalSpan.value) / noSpanLen
        : 24 / noSpanLen;
    };
    const formItemSlots = computed(() => {
      return {
        label() {
          return item.value.hideLabelText ? "" : item.value.label;
        },
        default() {
          return (
            <Row
              props={{
                gutter: 16,
                justify: "start",
                ...item.value,
                type: "flex",
              }}
            >
              {item.value.list.map((item, index) => {
                return item.show !== false ? (
                  <Col
                    props={{ span: getSpan(item.span), ...item }}
                    key={item.prop || index}
                  >
                    <FormItemWithMix
                      item={item}
                      style={{
                        marginBottom: 0,
                      }}
                    ></FormItemWithMix>
                  </Col>
                ) : null;
              })}
            </Row>
          );
        },
      };
    });
    return () =>
      item.value?.show ? (
        <OriginFormItem
          props={{ ...item.value, label: label.value }}
          scopedSlots={formItemSlots.value}
        ></OriginFormItem>
      ) : null;
  },
}) as any;
export default Mix;
