import { computed, defineComponent, inject, toRefs } from "vue";
import { globalProviderKey } from "../core";
import { useConfig } from "../core/useConfig";
import { renderComponent } from "@slacking/shared";
import FormItem from "./FormItem";
export default defineComponent({
  name: "mix",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { item } = toRefs(props);
    const { label } = useConfig();
    const { schema } = inject(globalProviderKey) as any;
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
    return () =>
      item.value?.show ? (
        <OriginFormItem
          props={{ ...item.value, label: label({ item, schema }) }}
        >
          <Row
            props={{
              gutter: 16,
              justify: "start",
              ...item.value,
              type: "flex",
            }}
          >
            {item.value.list.map((item) => {
              return item.show !== false ? (
                <Col
                  props={{ span: getSpan(item.span), ...item }}
                  key={item.prop}
                >
                  <FormItem
                    item={item}
                    style={{
                      marginBottom: 0,
                    }}
                  ></FormItem>
                </Col>
              ) : null;
            })}
          </Row>
        </OriginFormItem>
      ) : null;
  },
}) as any;
