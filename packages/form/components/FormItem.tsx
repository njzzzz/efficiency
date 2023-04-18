import { computed, defineComponent, inject, toRefs } from "vue";
import { globalProviderKey, useLabel, updateValue } from "@slacking/form";
import {
  renderComponent,
  getGlobalFormConfig,
  getValueByPath,
  getNotUndefinedValueByOrder,
  isEmptyInput,
} from "@slacking/shared";
const globalConfig = getGlobalFormConfig();
export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const { model, schema } = inject(globalProviderKey) as any;
    const { item } = toRefs(props) as any;
    const { label } = useLabel({ schema, item });
    const FormItem = renderComponent("FormItem");
    if (!item.value?.type) {
      console.log(`未知类型${item.value?.type}`);
    }
    const formItemProps = computed(() => {
      return {
        ...item.value,
        label: label.value,
      };
    });

    const hasInputEvent = computed(() => {
      return item.value?.ons?.input;
    });

    const innerFormItemProps = computed(() => {
      return {
        // value可以被复写
        value: getValueByPath(model.value, item.value.prop),
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
          ...(item.value?.ons ?? {}),
          input(val) {
            updateValue({ prop: item.value.prop, model, value: val });
            hasInputEvent.value &&
              item.value.ons.input(val, { model, schema, item });
          },
        },
        // 与配置重名的属性存在props中
        ...(item.value.props ?? {}),
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
    const isNoAsterisk = computed(() => {
      return getNotUndefinedValueByOrder([
        item.value.hideRequiredAsterisk,
        schema.value.hideRequiredAsterisk,
        globalConfig.hideRequiredAsterisk,
        false,
      ]);
    });
    const formItemSlots = computed(() => {
      const slots = item.value.scopedSlots ?? {};
      const scopedSlots = {};
      Object.keys(slots).forEach((slotName) => {
        scopedSlots[slotName] = () =>
          slots[slotName]({
            item,
            schema,
            model,
            dItem: innerFormItemProps,
          });
      });
      return {
        label() {
          return item.value.hideLabelText ? "" : formItemProps.value.label;
        },
        default() {
          return (
            <InnerFormItem.value
              {...{
                attrs: innerFormItemProps.value,
              }}
              props={innerFormItemProps.value}
              key={item.value.prop}
              on={innerFormItemProps.value.on}
              item={innerFormItemProps.value}
            ></InnerFormItem.value>
          );
        },
        ...scopedSlots,
      };
    });
    return () =>
      item.value?.show ? (
        <FormItem
          props={formItemProps.value}
          key={item.value.prop}
          class={{
            "is-no-asterisk": isNoAsterisk.value,
            "mix-type--no-label":
              formItemProps.value.type === "Mix" && isEmptyInput(label.value),
          }}
          scopedSlots={formItemSlots.value}
        ></FormItem>
      ) : null;
  },
}) as any;
