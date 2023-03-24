import { Ref, WatchOptionsWithHandler } from "vue";

export const convertListValueLabel = (
  list = [],
  from = { value: "value", label: "label", children: "children" },
  to = { value: "value", label: "label", children: "children" }
) => {
  let stack = [...list];
  let item = stack.pop();
  while (item) {
    item[to.value] = item[from.value];
    item[to.label] = item[from.label];
    item[to.children] = item[from.children];
    if (item[from.children]) {
      stack = [...stack, ...item[from.children]];
    }
    item = stack.pop();
  }
  return list;
};
export const convertListToMap = (
  list = [],
  { value = "value", children = "children" }
) => {
  const result = {};
  let stack = [...list];
  let item = stack.pop();
  while (item) {
    result[item[value]] = item;
    if (item[children]) {
      stack = [...stack, ...item[children]];
    }
    item = stack.pop();
  }
  return result;
};

export function getNotUndefinedValueByOrder(arr) {
  return arr.find((item) => item !== undefined);
}

export function undefinedAndTrueAsTrue(val) {
  if (Array.isArray(val)) {
    return val.every((item) => item === undefined || item === true);
  } else {
    return val === undefined || val === true;
  }
}
export function undefinedAndNotNullValueAsTrue(val) {
  if (Array.isArray(val)) {
    return val.every(
      (item) => item === undefined || !["", null].includes(item)
    );
  } else {
    return val === undefined || !["", null].includes(val);
  }
}
export function defineFormSchema(schema: Schema) {
  return schema;
}
interface Form {
  name: string;
  readonly: boolean;
  disabled: boolean;
  coreVersion: string;
  labelPosition: string;
  labelWidth: string;
  maxLength: number | false; // 全局值（plain value）最大长度 默认20
  minLength: number | false; // 全局值（plain value）最小长度 默认false
  autoOptionProps: boolean;
  size: string; //medium / small / mini
  inline: boolean;
  gutter: number;
  symbol: string;
  filterable: boolean;
  clearable: boolean;
  withObjectValue: boolean; // 带options的表单项是否需要抛出完整的值以_${prop}为键名
  independent: boolean; // 是否深克隆model和schema，这样会使相同引用数据的form互不影响
  list: any[];
  // 兜底
  [key: string]: unknown;
}
interface DependOnOptions {
  handler: (val: any, model: Ref<any>, item: any, oldVal: any) => any;
  immediate?: boolean;
  deep?: boolean;
}
interface FormItem {
  type: string;
  prop?: string;
  label?: string;
  defaultValue?: any;
  regexp?: RegExp;
  required?: boolean;
  trigger?: string | any[];
  message?: string;
  gutter?: number;
  filterable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  maxLength?: number | false; //最大长度 默认20
  minLength?: number | false; // 最小长度 默认false
  align?: string;
  justify?: string;
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
