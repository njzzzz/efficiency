import { computed, defineComponent, toRefs } from "vue";
import { renderComponent } from "@slacking/shared";
import FormItemWithMix from "./FormItemWithMix";
const Mix = defineComponent({
  name: "Mix",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { item } = toRefs(props);
    const Row = renderComponent("Row");
    const Col = renderComponent("Col");
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
    return () =>
      item.value?.show ? (
        <Row
          props={{
            gutter: 16,
            justify: "start",
            ...item.value,
            type: "flex",
          }}
          style={{
            width: "100%",
          }}
        >
          {item.value.list.map((item, index) => {
            return item.show !== false ? (
              <Col
                {...{ attrs: { ...item, ...(item.colAttrs ?? {}) } }}
                props={{ span: getSpan(item.span), ...item }}
                key={item.prop || index}
              >
                <FormItemWithMix
                  item={item}
                  style={{
                    marginBottom: 0,
                  }}
                  Mix={Mix}
                ></FormItemWithMix>
              </Col>
            ) : null;
          })}
        </Row>
      ) : null;
  },
}) as any;
export default Mix;
