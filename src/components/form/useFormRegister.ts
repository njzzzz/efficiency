import ReadonlyComponent from "./ReadonlyComponent";
export const components = {};
export const globalConfig = {
  maxLength: 50,
  minLength: false,
  withObjectValue: true,
  autoOptionProps: true,
  filterable: true,
  clearable: true,
  size: "small",
  deleteValueOnHidden: true,
  resetShowWithDefaultValue: true,
};
export function registerComponents(components = []) {
  components.forEach(({ name, component }) => {
    registerComponent({ name, component });
  });
  console.log("components", components);
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
export function registerComponent({ name, component, ...rest }) {
  if (components[name]) {
    throw new Error(`组件名称${name}已经被注册`);
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
interface globalConfig {
  maxLength: number | false;
  minLength: number | false;
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
}
export function setGlobalConfig(config: Partial<globalConfig> = {}) {
  Object.assign(globalConfig, config);
}
export function useFormRegister() {
  return {
    registerComponent,
    registerComponents,
    renderComponent,
    setGlobalConfig,
  };
}
