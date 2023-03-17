const adapter = {
  genFormProps(model, schema) {
    return {
      model,
      ...schema,
    };
  },
  genFormItemProps(model, item, schema) {
    return {
      ...item,
      label: item.label
        ? item.label + (item.symbol || schema.symbol || "：")
        : "",
    };
  },
  genComponentProps(model, item, schema) {
    return {
      ...item,
      disabled: item.disabled || schema.disabled,
      readonly: item.readonly || schema.readonly,
      modelValue: model[item.prop],
      "onUpdate:modelValue"(val) {
        model[item.prop] = val;
      },
    };
  },
};

export function useAdapter(
  params = {
    genFormProps: adapter.genFormProps,
    genFormItemProps: adapter.genFormItemProps,
    genComponentProps: adapter.genComponentProps,
  }
) {
  adapter.genFormProps = params.genFormProps;
  adapter.genFormItemProps = params.genFormItemProps;
  adapter.genComponentProps = params.genComponentProps;
}

export { adapter };
