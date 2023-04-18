import { defineFormSchema } from "@slacking/form";
export default defineFormSchema({
  list: [
    {
      type: "Switch",
      label: "readonly",
      prop: "readonly",
    },
    {
      type: "Switch",
      label: "disabled",
      prop: "disabled",
    },
    {
      label: "labelWidth",
      prop: "labelWidth",
    },
    {
      type: "Select",
      label: "labelPosition",
      prop: "labelPosition",
      options: [
        { value: "left", label: "left" },
        { value: "right", label: "right" },
        { value: "top", label: "top" },
      ],
    },
    {
      prop: "maxLen",
      label: "maxLen",
      type: "InputNumber",
    },
    {
      prop: "minLen",
      label: "minLen",
      type: "InputNumber",
    },
    {
      prop: "autoOptionProps",
      label: "autoOptionProps",
      type: "Switch",
    },
    {
      type: "Select",
      label: "size",
      prop: "size",
      options: [
        { value: "middle", label: "middle" },
        { value: "small", label: "small" },
        { value: "mini", label: "mini" },
      ],
    },
    {
      type: "Switch",
      label: "inline",
      prop: "inline",
    },
    {
      prop: "gutter",
      label: "gutter",
      type: "InputNumber",
    },
    {
      prop: "symbol",
      label: "symbol",
    },
    {
      type: "Switch",
      label: "clearable",
      prop: "clearable",
    },
    {
      type: "Switch",
      label: "filterable",
      prop: "filterable",
    },
    {
      type: "Switch",
      label: "deleteValueOnHidden",
      prop: "deleteValueOnHidden",
    },
    {
      type: "Switch",
      label: "resetShowWithDefaultValue",
      prop: "resetShowWithDefaultValue",
    },
    {
      label: "optionProps",
      prop: "optionProps",
      props: {
        type: "textarea",
      },
      rows: 5,
    },
    {
      type: "Switch",
      label: "hideLabelText",
      prop: "hideLabelText",
    },
    {
      type: "Switch",
      label: "hideRequiredAsterisk",
      prop: "hideRequiredAsterisk",
    },
  ],
});
