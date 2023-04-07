import {
  computed,
  defineComponent,
  inject,
  onRenderTriggered,
  set,
  toRefs,
} from "vue";
import { globalProviderKey } from "../core";
import { useConfig } from "../core/useConfig";
import { renderComponent, getGlobalFormConfig } from "@slacking/shared";
import { getNotUndefinedValueByOrder } from "../core/utils";
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
    const { label } = useConfig({ schema, item });
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
    const updateModelInput = (val) => {
      set(model.value, item.value.prop, val);
    };
    const hasInputEvent = computed(() => {
      return item.value?.ons?.input;
    });

    const innerFormItemProps = computed(() => {
      return {
        // value可以被复写
        value: model.value[item.value.prop],
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
            updateModelInput(val);
            hasInputEvent.value &&
              item.value.ons.input(val, { model, schema, item });
          },
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
    const formItemSlots = computed(() => {
      return {
        label() {
          return item.value.hideLabelText ? "" : item.value.label;
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
            ></InnerFormItem.value>
          );
        },
      };
    });
    return () =>
      item.value?.show ? (
        <FormItem
          props={formItemProps.value}
          key={item.value.prop}
          scopedSlots={formItemSlots.value}
        ></FormItem>
      ) : null;
  },
}) as any;
