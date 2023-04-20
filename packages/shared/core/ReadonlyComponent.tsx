import { computed, defineComponent, inject, useAttrs } from "vue";
import {
  isArray,
  getGlobalFormConfig,
  getNotUndefinedValueByOrder,
} from "@slacking/shared";
import { globalProviderKey } from "@slacking/form";
export default defineComponent({
  props: {
    value: {
      type: [String, Number, Array, Object, Boolean],
      default: "",
    },
  },
  setup(props) {
    const attrs = useAttrs() as any;
    const { model, schema } = inject(globalProviderKey) as any;

    function readonlyRender() {
      if (isArray(props.value)) {
        return attrs?.options?.length
          ? (props.value as string[])
              .map((item) => attrs?.__optionsMap?.[item]?.label)
              .join(",")
          : (props.value as string[]).join(",");
      } else {
        return attrs?.options?.length
          ? attrs?.__optionsMap?.[props.value as string]?.label
          : props.value;
      }
    }
    const valueText = computed(() => {
      const readonlyFormatter = getNotUndefinedValueByOrder([
        attrs.readonlyFormatter,
        schema.value.readonlyFormatter,
        getGlobalFormConfig().readonlyFormatter,
        null,
      ]);
      if (readonlyFormatter) {
        return readonlyFormatter({
          item: attrs,
          model,
          schema,
          value: props.value,
          readonlyRender,
        });
      }
      return readonlyRender();
    });
    return () => <span>{valueText.value}</span>;
  },
});
