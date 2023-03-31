import { computed, defineComponent, useAttrs, useSlots } from "vue";
import Mix from "./Mix";
import FormItem from "./FormItem";
const FormItemWithMix = defineComponent({
  setup() {
    const attrs = useAttrs() as any;
    const slots = useSlots() as any;
    const FormItemWithMixRender = computed<any>(() => {
      return defineComponent({
        setup() {
          return () =>
            attrs.item.type === "Mix" ? (
              <Mix
                item={attrs.item}
                key={attrs.item.prop || attrs.item.list?.[0]?.prop}
              ></Mix>
            ) : (
              <FormItem
                item={attrs.item}
                key={attrs.item.prop || attrs.item.list?.[0]?.prop}
              ></FormItem>
            );
        },
      });
    });
    return () =>
      slots.render ? (
        slots.render({
          item: attrs.item,
          render: FormItemWithMixRender,
        })
      ) : (
        <FormItemWithMixRender.value></FormItemWithMixRender.value>
      );
  },
}) as any;

export default FormItemWithMix;
