import { Ref } from "vue";
import ReadonlyComponent from "./ReadonlyComponent";
/**
 * 已经注册的组件
 * @type {Record<string, ComponentRegisterParams>}
 */
const components: Record<string, ComponentRegisterParams> = {};
const globalFormConfig: GlobalFormConfig = {
  maxLen: 100,
  minLen: false,
  autoOptionProps: true,
  labelPosition: "left",
  filterable: true,
  clearable: true,
  size: "small",
  deleteValueOnHidden: true,
  resetShowWithDefaultValue: true,
  defaultRender: "Input",
  hideLabelText: false,
  hideRequiredAsterisk: false,
  renderWithoutFormItem: false,
  deleteValueOnDependOnChange: false,
  setAsDefaultValueOnDependOnChange: false,
};
const globalTableConfig: GlobalTableConfig = {
  hideLabelText: true,
  hideRequiredAsterisk: true,
  hideHeaderRequiredAsterisk: false,
  showOverflowTooltip: true,
  renderWithoutFormItem: false,
  border: false,
};
interface ComponentRegisterParams extends Record<string, any> {
  component: any;
  name: string;
  /**
   * 重名注册是否覆盖，不覆盖，重名会报错
   */
  override?: boolean;
  disabledComponent?: any;
  readonlyComponent?: any;
}
/**
 * 批量注册自定义表单项
 * @param {ComponentRegisterParams[]} componentsRegister
 */
export function registerComponents(
  componentsRegister: ComponentRegisterParams[] = []
) {
  componentsRegister.forEach(({ name, component, ...reset }) => {
    registerComponent({ name, component, ...reset });
  });
}
interface ComponentStatus {
  readonly?: boolean;
  disabled?: boolean;
}
/**
 * 获取component
 * @param {string} name
 * @param {ComponentStatus} param1
 * @returns
 */
export function renderComponent(
  name,
  { readonly, disabled }: ComponentStatus = { readonly: false, disabled: false }
) {
  if (!components[name]) {
    throw new Error(`未注册的组件名${name}`);
  }
  return disabled
    ? components[name].disabledComponent ?? components[name].component
    : readonly
    ? components[name].readonlyComponent ?? ReadonlyComponent
    : components[name].component;
}
/**
 * 注册自定义表单项
 * @param {ComponentRegisterParams[]} param1
 */
export function registerComponent({
  name,
  component,
  override = false,
  ...rest
}: ComponentRegisterParams) {
  if (components[name] && !override) {
    throw new Error(
      `组件名称${name}已经被注册, 如果需要覆盖已注册组件请设置override属性为true`
    );
  }
  if (!component) {
    throw new Error(`组件名称${name}的组件为空`);
  }
  components[name] = {
    name,
    component,
    ...rest,
  };
}
/**
 * 获取全局表单配置
 * @returns {GlobalFormConfig} globalFormConfig
 */
export function getGlobalFormConfig() {
  return globalFormConfig;
}
/**
 * 获取全局表格配置
 * @returns {GlobalTableConfig} globalTableConfig
 */
export function getGlobalTableConfig() {
  return globalTableConfig;
}
/**
 * 获取已经注册的组件
 * @returns {GlobalTableConfig} globalTableConfig
 */
export function getRegisterComponents() {
  return components;
}
export const globalFormProviderKey = Symbol();
interface ReadonlyFormatterParams {
  item: any;
  model: Ref<any>;
  schema: Ref<any>;
  value: any;
  readonlyRender: () => any;
}
interface GlobalFormConfig {
  /**
   * 表单项值最大长度 false为不限制
   * @default 100
   */
  maxLen: number | false;
  /**
   * 表单项值最小长度 false为不限制
   * @default false
   */
  minLen: number | false;
  /**
   * 配置了 optionProps 的表单项是否自动转换options的value、label、children
   * @default true
   */
  autoOptionProps: boolean;
  /**
   * 是否开启全局表单项可搜索过滤
   * @default true
   */
  filterable: boolean;
  /**
   * 是否开启全局表单可清空
   * @default true
   */
  clearable: boolean;
  /**
   * 表单的size 需要表单支持
   * @default 'small'
   */
  size: string;
  /**
   * 表单隐藏时删除值
   * @default true
   */
  deleteValueOnHidden: boolean;
  /**
   * 表单被隐藏后再展示的时候使用defaultValue,如果设置为false则置为null如果多选则置为[]
   * @default true
   */
  resetShowWithDefaultValue: boolean;
  /**
   * 在表单项不配置type字段时 默认渲染的type 需要已经注册过
   * @default 'Input'
   */
  defaultRender: string;
  /**
   * 是否隐藏label文字
   * @default false
   */
  hideLabelText: boolean;
  /**
   * 是否隐藏必填的星号
   * @default false
   */
  hideRequiredAsterisk: boolean;
  /**
   * 是否只渲染表单组件，不使用formItem包裹
   * @default false
   */
  renderWithoutFormItem: boolean;
  /**
   * label的位置，需要表单组件支持
   * @default 'left'
   */
  labelPosition: string;
  /**
   * 在dependOn触发时清空当前表单项的值
   * @default false
   */
  deleteValueOnDependOnChange: boolean;
  /**
   * 在dependOn触发时清空当前表单项的值为配置的defaultValue
   * @default false
   */
  setAsDefaultValueOnDependOnChange: boolean;
  /**
   * readonly 状态展示的文字
   * @param {ReadonlyFormatterParams} args
   * @returns  {*}
   */
  readonlyFormatter?: (args: ReadonlyFormatterParams) => any;
}
interface GlobalTableConfig {
  /**
   * 表单型表格是否带label
   * @default false
   */
  hideLabelText: boolean;
  /**
   * 是否隐藏表头必填的星号
   * @default false
   */
  hideHeaderRequiredAsterisk: boolean;
  /**
   * 是否隐藏必填的星号
   * @default false
   */
  hideRequiredAsterisk: boolean;
  /**
   * 需要表格支持
   * @default true
   */
  showOverflowTooltip: boolean;
  /**
   * 是否只渲染表单组件，不使用formItem包裹
   * @default false
   */
  renderWithoutFormItem: boolean;
  /**
   * 表格是否带边框 需要表格支持
   */
  border: boolean;
}
/**
 * 设置表单全局公共属性
 * @param { Partial<GlobalFormConfig> } config
 */
export function setGlobalFormConfig(config: Partial<GlobalFormConfig> = {}) {
  Object.assign(globalFormConfig, config);
}
/**
 * 设置表格全局公共属性
 * @param { Partial<GlobalTableConfig> } config
 */
export function setGlobalTableConfig(config: Partial<GlobalTableConfig> = {}) {
  Object.assign(globalTableConfig, config);
}
/**
 * 表单注册函数
 * @returns {ReturnType<typeof useFormRegister>}
 */
export function useFormRegister() {
  return {
    registerComponent,
    registerComponents,
    renderComponent,
    setGlobalFormConfig,
  };
}
