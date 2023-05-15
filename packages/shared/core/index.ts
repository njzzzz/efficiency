import { Ref } from "vue";
import ReadonlyComponent from "./ReadonlyComponent";
const components = {};
const globalFormConfig: GlobalFormConfig = {
  maxLen: 100,
  minLen: false,
  withObjectValue: true,
  autoOptionProps: true,
  labelPosition: "left",
  filterable: true,
  clearable: true,
  size: "small",
  deleteValueOnHidden: true,
  resetShowWithDefaultValue: true,
  // 设置默认使用的渲染组件，需要通过registerComponent注册
  defaultRender: "Input",
  hideLabelText: false,
  hideRequiredAsterisk: false,
};
const globalTableConfig: GlobalTableConfig = {
  hideLabelText: true,
  hideRequiredAsterisk: true,
  hideHeaderRequiredAsterisk: false,
  showOverflowTooltip: true,
};
export function registerComponents(componentsRegister = []) {
  componentsRegister.forEach(({ name, component, ...reset }) => {
    registerComponent({ name, component, ...reset });
  });
}
export function renderComponent(
  name,
  { readonly, disabled } = { readonly: false, disabled: false }
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
export function registerComponent({
  name,
  component,
  override = false,
  ...rest
}) {
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
export function getGlobalFormConfig() {
  return globalFormConfig;
}
export function getGlobalTableConfig() {
  return globalTableConfig;
}

export function getRegisterComponents() {
  return components;
}
export const globalFormProviderKey = Symbol();
interface GlobalFormConfig {
  maxLen: number | false;
  minLen: number | false;
  // 带有options数组类型的表单，同时抛出选中的对象
  withObjectValue: boolean;
  // 使用配置的optionProps 自动转换options
  autoOptionProps: boolean;
  filterable: boolean;
  clearable: boolean;
  size: string;
  // 表单隐藏时删除值
  deleteValueOnHidden: boolean;
  // 表单被隐藏后再展示的时候使用defaultValue,如果设置为false则置为null如果多选则置为[]
  resetShowWithDefaultValue: boolean;
  // 默认渲染组件
  defaultRender: string;
  hideLabelText: boolean;
  hideRequiredAsterisk: boolean;
  labelPosition: string;
  readonlyFormatter?: (args: {
    item: any;
    model: Ref<any>;
    schema: Ref<any>;
    value: any;
    readonlyRender: () => unknown;
  }) => any;
}
interface GlobalTableConfig {
  // 表单型表格是否带label
  hideLabelText: boolean;
  hideHeaderRequiredAsterisk: boolean;
  hideRequiredAsterisk: boolean;
  showOverflowTooltip: boolean;
}
export function setGlobalFormConfig(config: Partial<GlobalFormConfig> = {}) {
  Object.assign(globalFormConfig, config);
}
export function setGlobalTableConfig(config: Partial<GlobalTableConfig> = {}) {
  Object.assign(globalTableConfig, config);
}
export function useFormRegister() {
  return {
    registerComponent,
    registerComponents,
    renderComponent,
    setGlobalFormConfig,
  };
}
