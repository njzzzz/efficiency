import { Ref } from "vue";

export function defineFormSchema(schema: Schema) {
  return schema;
}
export function defineFormSchemaList(list: FormItem[]) {
  return list;
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
  renderWithoutFormItem: boolean;
  hideLabelText: boolean;
  deleteValueOnDependOnChange: boolean;
  setAsDefaultValueOnDependOnChange: boolean;
  hideRequiredAsterisk: boolean;
  readonlyFormatter: (args: {
    item: FormItem;
    model: Ref<any>;
    schema: Ref<Schema>;
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
    item: FormItem;
    schema: Ref<Schema>;
    oldVal: any;
    getFullValue: (prop: any) => any;
    updateValue: (val: any) => void;
  }) => any;
  immediate?: boolean;
  deep?: boolean;
  flush?: "pre" | "post" | "sync";
}
export interface CustomFormItemProperties {}
export interface FormItem {
  type?: CustomFormItemProperties extends Record<"type", infer T> ? T : string;
  prop?: string;
  label?: string;
  /**
   * 默认值，优先级没有直接传入的model高
   */
  defaultValue?: any;
  /**
   * 表单验证使用的正则
   */
  regexp?: RegExp;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 触发验证的trigger 需要表单支持
   */
  trigger?: string | any[];
  /**
   * 验证出错的message
   */
  message?: string;
  /**
   * 仅作为布局类型（有list配置的均为布局类型）时使用，需要col组件支持
   */
  gutter?: number;
  filterable?: boolean;
  /**
   * 是否自动转换options格式
   */
  autoOptionProps?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  /**
   * 是否展示
   */
  show?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  maxLen?: number | false; //最大长度 默认100
  minLen?: number | false; // 最小长度 默认false
  /**
   * 仅作为布局类型（有list配置的均为布局类型）时使用，需要col组件支持
   */
  align?: string;
  /**
   * 仅作为布局类型（有list配置的均为布局类型）时使用，需要col组件支持
   */
  justify?: string;
  resetShowWithDefaultValue?: boolean;
  deleteValueOnHidden?: boolean;
  /**
   * 远程获取options选择项
   * @param {Ref<any>} model
   * @param {FormItem} item
   * @returns
   */
  asyncOptions?: (model: Ref<any>, item: FormItem) => unknown;
  /**
   * value label children 键值映射
   */
  optionProps?: Partial<OptionProps>;
  /**
   * 同步的options选择项
   */
  options?: any[];
  hideLabelText?: boolean;
  /**
   * 由于参数平铺，所以可能有属性重名，如果有重名则配置到props里面，暂时支持了type重名，如有其他重名参数，自行在表单项组件中处理
   */
  props?: Record<string, any>;
  /**
   * 仅作为布局类型（有list配置的均为布局类型）时使用，需要col组件支持 优先级比直接平铺属性高
   */
  colAttrs?: Record<string, any>;
  /**
   * 仅作为布局类型（有list配置的均为布局类型）时使用，需要form-item组件支持 优先级比直接平铺属性高
   */
  formItemAttrs?: Record<string, any>;
  renderWithoutFormItem?: boolean;
  /**
   * 在必填的情况下隐藏前面的必填星号
   */
  hideRequiredAsterisk?: boolean;
  /**
   * 在dependOn触发时清空当前表单项的值
   * @default false
   */
  deleteValueOnDependOnChange?: boolean;
  /**
   * 在dependOn触发时清空当前表单项的值为配置的defaultValue
   * @default false
   */
  setAsDefaultValueOnDependOnChange?: boolean;
  readonlyFormatter?: (args: {
    item: FormItem;
    model: Ref<any>;
    schema: Ref<Schema>;
    value: any;
    getFullValue: (prop: any) => any;
    readonlyRender: () => unknown;
  }) => any;
  /**
   * 插槽
   */
  scopedSlots?: Record<
    string,
    (args: {
      model: Ref<any>;
      item: Ref<FormItem>;
      schema: Ref<Schema>;
      /**
       * 内部处理过的item，主要用于在外部自行渲染form-item的情况
       */
      dItem: Ref<FormItem>;
      getFullValue: (prop: any) => any;
    }) => any
  >;
  ons?: Record<
    string,
    (
      val: any,
      opts: {
        model: Ref<any>;
        item: Ref<FormItem>;
        schema: Ref<Schema>;
        updateValue: (val: any) => void;
        getFullValue: (prop: any) => any;
      }
    ) => unknown
  >;
  /**
   * 继承validate.js的配置需要组件的支持，目前支持element-ui
   */
  validator?: (
    rule: any,
    value: any,
    callback: any,
    item: FormItem,
    model: Ref<any>,
    topUtils: { getFullValue: (prop: any) => any }
  ) => any;
  /**
   * 表单的互相依赖
   */
  dependOn?: Record<string, DependOnOptions["handler"] | DependOnOptions>;
  list?: FormItem[];
  // 兜底
  [key: string]: unknown;
}
export interface Schema extends Partial<Form> {
  list: FormItem[];
  [key: string]: unknown;
}
