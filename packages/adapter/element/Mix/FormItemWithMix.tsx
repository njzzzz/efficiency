import { defineComponent, useAttrs } from "vue";
// import Mix from ".";
import { FormItemRender } from "@slacking/form";
const FormItemWithMix = defineComponent({
  setup() {
    const attrs = useAttrs() as any;
    const Mix = attrs.mix;
    return () =>
      attrs.item.type === "Mix" ? (
        <FormItemRender
          item={{
            ...attrs.item,
            scopedSlots: {
              default() {
                return (
                  <Mix
                    item={attrs.item}
                    key={attrs.item.prop || attrs.item.list?.[0]?.prop}
                  ></Mix>
                );
              },
            },
          }}
          key={attrs.item.prop || attrs.item.list?.[0]?.prop}
        ></FormItemRender>
      ) : (
        <FormItemRender
          item={attrs.item}
          key={attrs.item.prop || attrs.item.list?.[0]?.prop}
        ></FormItemRender>
      );
  },
}) as any;

export default FormItemWithMix;
