import { computed, defineComponent, inject, set, toRefs } from "vue";
import { globalProviderKey } from "..";
import { useConfig } from "../useConfig";
import { globalConfig, renderComponent } from "../useFormRegister";
import { getNotUndefinedValueByOrder } from "../utils";

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
    if (item.value?.show === false) {
      return () => null;
    }
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
          ...(item.value?.on ?? {}),
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
}) as any;
