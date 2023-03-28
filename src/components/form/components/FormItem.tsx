import { computed, defineComponent, inject, set, toRefs, watch } from "vue";
import { globalProviderKey } from "..";
import { useConfig } from "../useConfig";
import { renderComponent, getGlobalConfig } from "../useFormRegister";
import { getNotUndefinedValueByOrder } from "../utils";
const globalConfig = getGlobalConfig();
export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const { model, schema } = inject(globalProviderKey) as any;
    const { label } = useConfig();
    const { item } = toRefs(props) as any;
    const FormItem = renderComponent("FormItem");
    if (!item.value?.type) {
      console.log(`未知类型${item.value?.type}`);
    }
    const formItemProps = computed(() => {
      return {
        ...item.value,
        label: label({ item, schema }),
      };
    });
    const innerFormItemProps = computed(() => {
      const ons = item.value?.on ?? {};
      Object.keys(ons).forEach((key) => {
        const originOn = ons[key];
        ons[key] = (...resets) => {
          originOn(...resets, model, item, schema);
        };
      });
      return {
        ...item.value,
        clearable: getNotUndefinedValueByOrder([
          item.value.clearable,
          schema.value.clearable,
          globalConfig.clearable,
        ]),
        multiple: getNotUndefinedValueByOrder([item.value.multiple, false]),
        disabled: getNotUndefinedValueByOrder([
          item.value.disabled,
          schema.value.disabled,
          false,
        ]),
        readonly: getNotUndefinedValueByOrder([
          item.value.readonly,
          schema.value.readonly,
          false,
        ]),
        value: model.value[item.value.prop],
        size: getNotUndefinedValueByOrder([
          item.value.size,
          schema.value.size,
          globalConfig.size,
        ]),
        filterable: getNotUndefinedValueByOrder([
          item.value.filterable,
          schema.value.filterable,
          globalConfig.filterable,
        ]),
        on: {
          input(val) {
            set(model.value, item.value.prop, val);
          },
          ...ons,
        },
      };
    });
    const InnerFormItem = computed(() =>
      renderComponent(item.value.type, {
        disabled: getNotUndefinedValueByOrder([
          item.value.disabled,
          schema.value.disabled,
          false,
        ]),
        readonly: getNotUndefinedValueByOrder([
          item.value.readonly,
          schema.value.readonly,
          false,
        ]),
      })
    );
    return () =>
      item.value?.show ? (
        <FormItem props={formItemProps.value} key={item.value.prop}>
          <InnerFormItem.value
            {...{ attrs: innerFormItemProps.value }}
            props={innerFormItemProps.value}
            key={item.value.prop}
            on={innerFormItemProps.value.on}
          ></InnerFormItem.value>
        </FormItem>
      ) : null;
  },
}) as any;
