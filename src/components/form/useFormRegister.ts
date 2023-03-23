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
  withObjectValue: boolean;
  autoOptionProps: boolean;
  filterable: boolean;
  clearable: boolean;
  size: string;
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
