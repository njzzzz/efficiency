import { defineComponent, useAttrs } from "vue";
import Mix from "./Mix";
import FormItem from "./FormItem";
const FormItemWithMix = defineComponent({
  setup() {
    const attrs = useAttrs() as any;
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
}) as any;

export default FormItemWithMix;
