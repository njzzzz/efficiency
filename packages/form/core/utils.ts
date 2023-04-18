import { Ref } from "vue";

export function defineFormSchema(schema: Schema) {
  return schema;
}
export interface OptionProps {
  value: string;
  label: string;
  children: string;
  disabled: string;
  // 兜底
  [key: string]: unknown;
}
export interface Form {
  name: string;
  readonly: boolean;
  disabled: boolean;
  coreVersion: string;
  labelPosition: string;
  labelWidth: string;
  maxLen: number | false; // 全局值（plain value）最大长度 默认100
  minLen: number | false; // 全局值（plain value）最小长度 默认false
  autoOptionProps: boolean;
  size: string; //medium / small / mini
  inline: boolean;
  gutter: number;
  symbol: string;
  filterable: boolean;
  clearable: boolean;
  deleteValueOnHidden: boolean; // 在表单隐藏时是否删除键
  resetShowWithDefaultValue: boolean;
  optionProps: Partial<OptionProps>;
  hideLabelText: boolean;
  hideRequiredAsterisk: boolean;
  readonlyFormatter: (args: {
    item: any;
    model: Ref<any>;
    schema: Ref<any>;
    value: any;
    readonlyRender: () => unknown;
  }) => any;
  ons: Record<string, any>;
  // 兜底
  [key: string]: unknown;
}
export interface DependOnOptions {
  handler: (args: {
    val: any;
    model: Ref<any>;
    item: any;
    schema: Ref<any>;
    oldVal: any;
    updateValue: (val: any) => void;
  }) => any;
  immediate?: boolean;
  deep?: boolean;
  flush?: "pre" | "post" | "sync";
}
export interface FormItem {
  type?: string;
  prop?: string;
  label?: string;
  defaultValue?: any;
  regexp?: RegExp;
  required?: boolean;
  trigger?: string | any[];
  message?: string;
  gutter?: number;
  filterable?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  show?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  maxLen?: number | false; //最大长度 默认100
  minLen?: number | false; // 最小长度 默认false
  align?: string;
  justify?: string;
  resetShowWithDefaultValue?: boolean;
  deleteValueOnHidden?: boolean;
  asyncOptions?: (model: Ref<any>, item: any) => unknown;
  optionProps?: Partial<OptionProps>;
  options?: any[];
  hideLabelText?: boolean;
  props?: Record<string, any>;
  // 在必填的情况下隐藏前面的必填星号
  hideRequiredAsterisk?: boolean;
  readonlyFormatter?: (args: {
    item: any;
    model: Ref<any>;
    schema: Ref<any>;
    value: any;
    readonlyRender: () => unknown;
  }) => any;
  scopedSlots?: Record<
    string,
    (args: {
      model: Ref<any>;
      item: Ref<any>;
      schema: Ref<Schema>;
      dItem: Ref<any>;
    }) => any
  >;
  ons?: Record<
    string,
    (
      val: any,
      opts: {
        model: Ref<any>;
        item: Ref<any>;
        schema: Ref<Schema>;
        updateValue: (val: any) => void;
      }
    ) => unknown
  >;
  validator?: (
    rule: any,
    value: any,
    callback: any,
    item: any,
    model: Ref<any>
  ) => any;
  dependOn?: Record<string, DependOnOptions["handler"] | DependOnOptions>;
  list?: FormItem[];
  // 兜底
  [key: string]: unknown;
}

interface Schema extends Partial<Form> {
  list: FormItem[];
}
