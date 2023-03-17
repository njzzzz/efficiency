import { defineComponent, watch } from "vue";
import { adapter } from "./adapter";

function init(list, model = {}) {
  const unWatches = [];
  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    if (item.dependOn) {
      const keys = Object.keys(item.dependOn);
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const dependOnOptions = item.dependOn[key];
        const { handler, ...options } = dependOnOptions;
        const unWatch = watch(
          () => model[key],
          (val, oldVal) => {
            handler(val, model, item, oldVal);
          },
          { immediate: true, deep: false, ...options }
        );
        unWatches.push(unWatch);
      }
    }
    if (item.asyncOptions) {
      item.asyncOptions().then((opts) => {
        item.options = opts;
      });
    }
    if (item.list) {
      init(item.list, model);
    }
  }
  return unWatches;
}

export default function anyFormVue() {
  this.render = (props) => {
    const Form = this.Form();
    const FormItem = this.FormItem();
    // const Row = this.Row();
    const Col = this.Col();
    const renderComponent = this.renderComponent.bind(this);
    const Component = defineComponent({
      props: {
        schema: {},
        model: {},
      },
      setup(props) {
        const formMemo = {};
        // #TODO 不同的form使用同一个schema引用，暂不处理，外部自行clone
        // const schema = reactive(cloneDeep(props.schema ?? {}));
        if (props.schema?.list?.length) {
          init(props.schema.list, props.model);
        } else {
          return () => null;
        }

        return () => (
          <Form {...adapter.genFormProps(props.model, props.schema)}>
            {props.schema.list.map((item) => {
              if (item.type === "AnyMix" && Array.isArray(item.list)) {
                return item.show !== false ? (
                  <FormItem {...item}>
                    {item.list.map((subItem) => {
                      const InnerFormItem = renderComponent(subItem.type, {
                        disabled: subItem.disabled || props.schema.disabled,
                        readonly: subItem.readonly || props.schema.readonly,
                      });
                      return subItem.show !== false ? (
                        <Col
                          span={
                            subItem.span || Math.floor(24 / item.list.length)
                          }
                        >
                          <FormItem
                            {...adapter.genFormItemProps(
                              props.model,
                              subItem,
                              props.schema
                            )}
                            key={subItem.prop}
                          >
                            <InnerFormItem
                              {...adapter.genComponentProps(
                                props.model,
                                subItem,
                                props.schema,
                                formMemo
                              )}
                              key={subItem.prop}
                            ></InnerFormItem>
                          </FormItem>
                        </Col>
                      ) : null;
                    })}
                  </FormItem>
                ) : //
                null;
              } else {
                const InnerFormItem = renderComponent(item.type, {
                  disabled: item.disabled || props.schema.disabled,
                  readonly: item.readonly || props.schema.readonly,
                });
                return item.show !== false ? (
                  // <Col span={item.span}>
                  <FormItem
                    {...adapter.genFormItemProps(
                      props.model,
                      item,
                      props.schema
                    )}
                    key={item.prop}
                  >
                    <InnerFormItem
                      {...adapter.genComponentProps(
                        props.model,
                        item,
                        props.schema,
                        formMemo
                      )}
                      key={item.prop}
                    ></InnerFormItem>
                  </FormItem>
                ) : // </Col>
                null;
              }
            })}
          </Form>
        );
      },
    });
    return <Component {...props}></Component>;
  };
}
