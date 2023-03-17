import ReadonlyComponent from "./ReadonlyComponent.jsx";
const components = {};
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
export function useFormRegister() {
  return {
    registerComponent,
    registerComponents,
    renderComponent,
  };
}
