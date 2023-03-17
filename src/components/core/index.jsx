const formsMap = new WeakMap();
class AnyForm {
  components = {};
  schema = {};
  ReadonlyComponent = {};
  constructor({ Form, FormItem, ReadonlyComponent, Row, Col }) {
    this.registerComponents([
      { name: "Form", component: Form },
      { name: "FormItem", component: FormItem },
      { name: "Row", component: Row },
      { name: "Col", component: Col },
    ]);
    this.ReadonlyComponent = ReadonlyComponent;
  }
  registerComponent({ name, ...rest }) {
    if (this.components[name]) {
      throw new Error(`组件名称${name}已经被注册`);
    }
    this.components[name] = {
      name,
      ...rest,
    };
  }
  registerComponents(components = []) {
    components.forEach(({ name, component }) => {
      this.registerComponent({ name, component });
    });
  }
  renderComponent(
    name,
    { readonly, disabled } = { readonly: false, disabled: false }
  ) {
    if (!this.components[name]) {
      throw new Error(`未注册的组件名${name}`);
    }
    return disabled
      ? this.components[name].disabledComponent ??
          this.components[name].component
      : readonly
      ? this.components[name].readonlyComponent ?? this.ReadonlyComponent
      : this.components[name].component;
  }

  use(plugin) {
    plugin.call(this);
  }
  // updateSchema() {}
  Form() {
    return this.components.Form.component;
  }
  FormItem() {
    return this.components.FormItem.component;
  }
  Row() {
    return this.components.Row.component;
  }
  Col() {
    return this.components.Col.component;
  }
  async mayBeFunc(maybe) {
    if (typeof maybe === "function") return await Promise.resolve(maybe());
    return maybe;
  }
  /**
   * @description 在adapter里实现
   * @overrides
   */
  render() {
    return null;
  }
}
export { formsMap };
export default AnyForm;
