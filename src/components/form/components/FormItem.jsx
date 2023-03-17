import { computed, defineComponent, inject, set, toRefs } from "vue";
import { globalProviderKey } from "..";
import { useConfig } from "../useConfig";
import { renderComponent } from "../useFormRegister";

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const { model, schema } = inject(globalProviderKey);
    const { label } = useConfig();
    const { item } = toRefs(props);
    const FormItem = renderComponent("FormItem");
    if (item.value?.show === false) {
      return () => null;
    }
    if (!item.value?.type) {
      console.log(`未知类型${item.value?.type}`);
    }
    const formItemProps = computed(() => {
      return {
        ...item.value,
        label: label({ item, schema }).value,
      };
    });
    const innerFormItemProps = computed(() => {
      return {
        ...item.value,
        disabled: item.value.disabled || schema.value.disabled,
        readonly: item.value.readonly || schema.value.readonly,
        value: model.value[item.value.prop],
        size: item.value.size || schema.value.size,
        on: {
          input(val) {
            set(model.value, item.value.prop, val);
          },
          ...(item.value?.on ?? {}),
        },
      };
    });
    const InnerFormItem = computed(() =>
      renderComponent(item.value.type, {
        disabled: item.value.disabled || schema.value.disabled,
        readonly: item.value.readonly || schema.value.readonly,
      })
    );
    return () => (
      <FormItem props={formItemProps.value} key={item.value.prop}>
        <InnerFormItem.value
          props={innerFormItemProps.value}
          key={item.value.prop}
          on={innerFormItemProps.value.on}
        ></InnerFormItem.value>
      </FormItem>
    );
  },
});
