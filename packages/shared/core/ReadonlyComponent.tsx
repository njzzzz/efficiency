import { computed, defineComponent, useAttrs } from "vue";
export default defineComponent({
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: "",
    },
    model: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const attrs = useAttrs() as any;
    const valueText = computed(() => {
      if (attrs.readonlyFormatter) {
        return attrs.readonlyFormatter({
          item: attrs,
          model: props.model,
          value: props.value,
        });
      }
      return attrs?.options?.length
        ? attrs?.__optionsMap?.[props.value as string]?.label
        : props.value;
    });
    return () => <span>{valueText.value}</span>;
  },
});
