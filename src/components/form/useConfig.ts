import { computed, watch, set, watchEffect } from "vue";
import { globalConfig } from "./useFormRegister";
import {
  convertListValueLabel,
  convertListToMap,
  undefinedAndTrueAsTrue,
} from "./utils";
const functionalProps = ["label"];
export function realType(may) {
  return Object.prototype.toString.call(may);
}

export function realTypeEqual(may, type) {
  return realType(may) === `[object ${type}]`;
}

export function useConfig() {
  function label({ item, schema }) {
    realType(item.value.symbol);
    const symbol = realTypeEqual(item.value.symbol, "Undefined")
      ? realTypeEqual(schema.value.symbol, "Undefined")
        ? ":"
        : schema.value.symbol
      : item.value.symbol;
    return item.value.label ? item.value.label + symbol : "";
  }
  return {
    label,
  };
}

export function proxyItem(list, index, item, model) {
  const proxyItem = new Proxy(item, {
    get(target, prop) {
      if (
        functionalProps.includes(prop as string) &&
        typeof target[prop] === "function"
      ) {
        return computed(() => target[prop](item, model)).value;
      } else {
        return target[prop];
      }
    },
    set(target, prop, newValue, receiver) {
      return Reflect.set(target, prop, newValue, receiver);
    },
  });
  proxyItem.__rawItem = item;
  list[index] = proxyItem;
}

export function generatorRules(item, runtimeModel, runtimeSchema, elFormRef) {
  const rule = {} as any;
  rule.trigger = item.trigger || ["change", "blur"];
  const message = item?.message ?? `请完善${item?.label}`;
  const regexp = item.regexp;
  if (item.required) {
    rule.validator = (rule, value, callback) => {
      if ([null, undefined, ""].includes(value)) {
        callback(new Error(message));
      } else {
        if (regexp) {
          if (regexp.test(value)) {
            callback();
          } else {
            callback(new Error(message));
          }
        } else {
          callback();
        }
      }
    };
  }
  if (item.validator) {
    rule.validator = (rule, value, callback) => {
      item.validator(rule, value, callback, item, runtimeModel, elFormRef);
    };
  }
  // 只处理Mix类型的多对一格式，如果未配置prop择按照正常表单执行，只处理布局
  if (item.type === "Mix" && item.prop) {
    // 子表单指定 required 为 false，则不会触发验证
    if (item.required !== false) {
      item.list.map((child) => {
        child.trigger = child.trigger || item.trigger;
        child.validator = child.validator
          ? (rule, value, callback) => {
              item.validator(
                rule,
                value,
                callback,
                child,
                runtimeModel,
                elFormRef
              );
            }
          : (rule, value, callback) => {
              callback();
              // 触发父级验证
              elFormRef.value.validateField(item.prop);
            };
        return child;
      });
      item.rules = [
        {
          trigger: rule.trigger,
          validator(rule, value, callback) {
            if (!value) {
              return callback(new Error(message));
            }
            // 只验证必填的子表单
            const requiredChildrenProps = item.list
              .filter((child) => child.required !== false)
              .map((child) => child.prop);
            const values = requiredChildrenProps.reduce((acc, prop) => {
              acc.push(value[prop]);
              return acc;
            }, []);
            if (item.validator) {
              item.validator(
                rule,
                value,
                callback,
                item,
                runtimeModel,
                elFormRef
              );
            } else if (!values?.length) {
              callback(new Error(message));
            } else if (
              values.some((v) => {
                if (Array.isArray(v)) return !v?.length;
                return [null, undefined, ""].includes(v);
              })
            ) {
              callback(new Error(message));
            } else {
              if (regexp) {
                if (regexp.test(value)) {
                  callback();
                } else {
                  callback(new Error(message));
                }
              } else {
                callback();
              }
            }
          },
        },
      ];
    }
  }
  // 配置长度
  let lengthRule = null;
  const maxLength =
    item.maxLength || runtimeSchema.value.maxLength || globalConfig.maxLength;
  const minLength =
    item.minLength || runtimeSchema.value.minLength || globalConfig.minLength;
  let maxValidator = null;
  let minValidator = null;
  if (typeof maxLength === "number" || maxLength === 0) {
    maxValidator = (rule, value, callback, pass = true) => {
      if (typeof value === "string") {
        if (value.length > maxLength) {
          callback(new Error(`最大长度不能超过${maxLength}`));
        } else {
          pass && callback();
        }
      }
      pass && callback();
    };
  }
  if (typeof minLength === "number" || minLength === 0) {
    minValidator = (rule, value, callback) => {
      if (typeof value === "string") {
        if (value.length < minLength) {
          callback(new Error(`最小长度不能短于${maxLength}`));
        } else {
          callback();
        }
      }
      callback();
    };
  }
  if (maxLength) {
    lengthRule = {
      trigger: rule.trigger,
      validator(rule, value, callback) {
        maxValidator(rule, value, callback);
      },
    };
  }
  if (minLength) {
    lengthRule = {
      trigger: rule.trigger,
      validator(rule, value, callback) {
        minValidator(rule, value, callback);
      },
    };
  }
  if (maxLength && minLength) {
    lengthRule = {
      trigger: rule.trigger,
      validator(rule, value, callback) {
        maxValidator(rule, value, callback, false);
        minValidator(rule, value, callback);
      },
    };
  }

  if (item.rules) {
    lengthRule && item.rules.push(lengthRule);
  }
  item.rules =
    item.rules ||
    (item.required || item.validator
      ? lengthRule
        ? [rule, lengthRule]
        : [rule]
      : []);
}

export function generatorDependOn(item, runtimeModel) {
  const unWatches = [];
  if (item.dependOn) {
    const keys = Object.keys(item.dependOn);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const dependOnOptions = item.dependOn[key];
      if (typeof dependOnOptions === "function") {
        const unWatch = watch(
          () => runtimeModel.value[key],
          (val, oldVal) => {
            dependOnOptions(val, runtimeModel, item, oldVal);
          },
          { immediate: true, deep: true }
        );
        unWatches.push(unWatch);
      } else {
        const { handler, ...options } = dependOnOptions;
        const unWatch = watch(
          () => runtimeModel.value[key],
          (val, oldVal) => {
            handler(val, runtimeModel, item, oldVal);
          },
          { immediate: true, deep: false, ...options }
        );
        unWatches.push(unWatch);
      }
    }
  }
  return unWatches;
}

export function generatorOptions(item, runtimeModel) {
  if (item.asyncOptions) {
    item.asyncOptions(runtimeModel, item).then((opts) => {
      item.options = opts;
    });
  }
}

export function generatorReactiveModelPropsDefaultValue(item, runtimeModel) {
  const { multiple = false } = item;
  function getDefaultValue() {
    return realTypeEqual(runtimeModel.value[item.prop], "Undefined")
      ? realTypeEqual(item.defaultValue, "Undefined")
        ? multiple
          ? []
          : null
        : item.defaultValue
      : runtimeModel.value[item.prop];
  }
  item.prop && set(runtimeModel.value, item.prop, getDefaultValue());
}

export function dealWithMixTypeValue(item, runtimeModel) {
  if (item.type !== "Mix" || !item.prop) return;
  watchEffect(() => {
    runtimeModel.value[item.prop] = item.list.reduce((acc, config) => {
      const { prop } = config;
      acc[prop] = runtimeModel.value[prop];
      return acc;
    }, {});
  });
}

export function patchReactiveProps(item) {
  if (!Reflect.has(item, "options")) {
    set(item, "options", []);
  }
}
// 将select, cascader等选项的数组或者对象值使用下划线透出
export function generatorWithObjectValue(item, runtimeModel, runtimeSchema) {
  const optionProps = item.optionProps || runtimeSchema.value.optionProps;
  const withObjectValue = undefinedAndTrueAsTrue([
    item.withObjectValue,
    runtimeSchema.value.withObjectValue,
    globalConfig.withObjectValue,
  ]);
  const { value = "value", children = "children" } = optionProps || {};
  const { multiple = false } = item;
  const prop = item.prop;

  if (withObjectValue && prop) {
    watch(
      () => item.options,
      (options) => {
        if (options?.length) {
          item.__optionsMap = convertListToMap(options, {
            value,
            children,
          });
        }
      },
      { immediate: true, deep: true }
    );
    watch(
      () => [runtimeModel.value[prop], item.options],
      ([newVal]) => {
        if (item.__optionsMap) {
          runtimeModel.value[`_${prop}`] = multiple
            ? newVal.map((v) => item.__optionsMap[v])
            : item.__optionsMap[newVal];
        }
      },
      { immediate: true, deep: true }
    );
  }
}

// 修改options的value、label、children值， 可在schema或者item配置中关闭， autoOptionProps: false
export function generatorOptionsByOptionProps(
  item,
  runtimeModel,
  runtimeSchema
) {
  const optionProps = item.optionProps || runtimeSchema.value.optionProps;
  const autoOptionProps = undefinedAndTrueAsTrue([
    item.autoOptionProps,
    runtimeSchema.value.autoOptionProps,
    globalConfig.autoOptionProps,
  ]);
  const {
    value = "value",
    label = "label",
    children = "children",
  } = optionProps || {};
  if (optionProps && autoOptionProps) {
    watchEffect(() => {
      if (item?.options?.length) {
        item.options = convertListValueLabel(item.options, {
          value,
          label,
          children,
        });
      }
    });
  }
}
