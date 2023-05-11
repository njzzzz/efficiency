import { computed, watch, set, watchEffect, del, Ref } from "vue";
import {
  getGlobalFormConfig,
  getPropByPath,
  getValueByPath,
  isUndef,
  convertListValueLabel,
  convertListToMap,
  undefinedAndTrueAsTrue,
  getNotUndefinedValueByOrder,
} from "@slacking/shared";
const functionalProps = ["label"];
const globalConfig = getGlobalFormConfig();
export function realType(may) {
  return Object.prototype.toString.call(may);
}
export function realTypeEqual(may, type) {
  return realType(may) === `[object ${type}]`;
}
export function updateValue({
  prop,
  model,
  value,
}: {
  prop: string;
  model: Ref<any>;
  value: any | Record<string, any>;
}): void {
  if (isUndef(prop) && realTypeEqual(value, "Object")) {
    Object.keys(value).forEach((key) => {
      const { o, k } = getPropByPath(model.value, key, true);
      set(o, k, value);
    });
  } else {
    const { o, k } = getPropByPath(model.value, prop, true);
    set(o, k, value);
  }
}
export function getDefaultValue(
  item,
  runtimeModel,
  runtimeSchema,
  withDefaultValue = true,
  withModelValue = true
) {
  const { multiple = false } = item;
  const values = [];
  let changedByDefault = false;
  if (withModelValue) {
    values.push(getValueByPath(runtimeModel.value, item.prop));
  }
  if (withDefaultValue) {
    if (values[0] === undefined) {
      changedByDefault = true;
    }
    values.push(item.defaultValue);
  }
  values.push(multiple ? [] : null);
  return {
    value: getNotUndefinedValueByOrder(values),
    changedByDefault,
  };
}

export function useLabel({ item, schema }) {
  const label = computed(() => {
    realType(item.value.symbol);
    const symbol = isUndef(item.value.symbol)
      ? isUndef(schema.value.symbol)
        ? ":"
        : schema.value.symbol
      : item.value.symbol;
    return item.value.label ? item.value.label + symbol : "";
  });
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
  const multiple = getNotUndefinedValueByOrder([
    item.multiple,
    item.prop?.multiple,
    false,
  ]);
  rule.trigger = item.trigger || ["change", "blur"];
  const message = item?.message ?? `请完善${item?.label}`;
  const regexp = item.regexp;
  if (item.required) {
    rule.validator = (rule, value, callback) => {
      if (
        [null, undefined, ""].includes(value) ||
        (Array.isArray(value) && !value.length)
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
    };
  }
  if (item.validator) {
    rule.validator = (rule, value, callback) => {
      item.validator(rule, value, callback, item, runtimeModel, elFormRef);
    };
  }
  // 配置长度
  let lengthRule = null;
  const maxLen = getNotUndefinedValueByOrder([
    item.maxLen,
    runtimeSchema.value.maxLen,
    globalConfig.maxLen,
    100,
  ]);
  const minLen = getNotUndefinedValueByOrder([
    item.minLen,
    runtimeSchema.value.minLen,
    globalConfig.minLen,
    false,
  ]);
  let maxValidator = null;
  let minValidator = null;
  if (typeof maxLen === "number" || maxLen === 0) {
    maxValidator = (rule, value, callback, pass = true) => {
      if (multiple) {
        if (value?.length > maxLen) {
          callback(new Error(`最多只能选择${maxLen}个`));
        } else {
          pass && callback();
        }
      } else {
        if (value?.length > maxLen) {
          callback(new Error(`值最大长度不能超过${maxLen}`));
        }
        pass && callback();
      }
    };
  }
  if (typeof minLen === "number" || minLen === 0) {
    minValidator = (rule, value, callback) => {
      if (multiple) {
        if (value?.length < minLen) {
          callback(new Error(`最少需要选择${minLen}条`));
        } else {
          callback();
        }
      } else {
        if (value?.length < minLen) {
          callback(new Error(`最小长度不能短于${minLen}`));
        }
        callback();
      }
    };
  }
  if (maxLen) {
    lengthRule = {
      trigger: rule.trigger,
      validator(rule, value, callback) {
        maxValidator(rule, value, callback);
      },
    };
  }
  if (minLen) {
    lengthRule = {
      trigger: rule.trigger,
      validator(rule, value, callback) {
        minValidator(rule, value, callback);
      },
    };
  }
  if (maxLen && minLen) {
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
export function generatorDependOn(
  item,
  runtimeModel,
  runtimeSchema,
  deleteValueOnHiddenFunc
) {
  const _updateValue = (val) => {
    updateValue({ prop: item.prop, model: runtimeModel, value: val });
  };
  const unWatches = [];
  // 收集所有callback 在后续做展示隐藏功能时，需要等所有watch都执行完成才能进行展示隐藏的判断
  if (item.dependOn) {
    const keys = Object.keys(item.dependOn);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const dependOnOptions = item.dependOn[key];
      if (typeof dependOnOptions === "function") {
        const unWatch = watch(
          () => getValueByPath(runtimeModel.value, key),
          (val, oldVal) => {
            Promise.resolve(
              dependOnOptions({
                val,
                oldVal,
                model: runtimeModel,
                schema: runtimeSchema,
                item,
                updateValue: _updateValue,
              })
            ).then(() => {
              deleteValueOnHiddenFunc(item, runtimeModel, runtimeSchema);
            });
          },
          { immediate: true, deep: true }
        );
        unWatches.push(unWatch);
      } else {
        const { handler, ...options } = dependOnOptions;
        const unWatch = watch(
          () => getValueByPath(runtimeModel.value, key),
          (val, oldVal) => {
            Promise.resolve(
              handler({
                val,
                oldVal,
                model: runtimeModel,
                schema: runtimeSchema,
                item,
                updateValue: _updateValue,
              })
            ).then(() => {
              deleteValueOnHiddenFunc(item, runtimeModel, runtimeSchema);
            });
          },
          { immediate: true, deep: false, ...options }
        );
        unWatches.push(unWatch);
      }
    }
  }
  return {
    unWatches,
  };
}

export function generatorOptions(item, runtimeModel, runtimeSchema) {
  const { autoOptionProps, value, label, children, disabled } = dealOptionProps(
    item,
    runtimeSchema
  );
  if (item.asyncOptions) {
    item.asyncOptions(runtimeModel, item).then((opts) => {
      item.options = autoOptionProps
        ? convertListValueLabel(opts, {
            value,
            label,
            children,
            disabled,
          })
        : opts;
    });
  }
}

export function generatorReactiveModelPropsDefaultValue(
  item,
  runtimeModel,
  runtimeSchema
) {
  if (item.prop) {
    const defaultValue = getDefaultValue(item, runtimeModel, runtimeSchema);
    updateValue({
      prop: item.prop,
      model: runtimeModel,
      value: defaultValue.value,
    });
    if (defaultValue.changedByDefault && item.ons?.defaultValue) {
      item.ons.defaultValue(defaultValue.value);
    }
  }
}
/**
 * @deprecated
 * @param item
 * @param runtimeModel
 */
export function dealWithMixTypeValue(item, runtimeModel) {
  if (item.type !== "Mix" || !item.prop) return;
  watchEffect(() => {
    const mixTypeWithPropValue = item.list.reduce((acc, config) => {
      const { prop } = config;
      if (config.show && prop !== undefined) {
        acc[prop] = runtimeModel.value[prop];
      }
      return acc;
    }, {});
    runtimeModel.value[item.prop] = mixTypeWithPropValue;
    const onMixValue = item.ons?.mixValue;
    onMixValue && onMixValue(mixTypeWithPropValue);
  });
}

export function patchReactiveProps(item, runtimeSchema) {
  if (!Reflect.has(item, "options")) {
    set(item, "options", []);
  }
  if (!Reflect.has(item, "__optionsMap")) {
    set(item, "__optionsMap", {});
  }
  if (!Reflect.has(item, "show")) {
    set(item, "show", true);
  }
  if (!Reflect.has(item, "type")) {
    set(
      item,
      "type",
      getNotUndefinedValueByOrder([
        runtimeSchema.value.defaultRender,
        globalConfig.defaultRender,
        "Input",
      ])
    );
  }
  if (!Reflect.has(item, "hideLabelText")) {
    set(
      item,
      "hideLabelText",
      getNotUndefinedValueByOrder([
        item.hideLabelText,
        runtimeSchema.value.hideLabelText,
        globalConfig.hideLabelText,
        false,
      ])
    );
  }
}
/**
 * @description 将select, cascader等选项的数组或者对象值使用下划线透出
 * @deprecated
 * @param item
 * @param runtimeModel
 * @param runtimeSchema
 */
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
          const objectValue = multiple
            ? newVal.map((v) => item.__optionsMap[v])
            : item.__optionsMap[newVal];
          runtimeModel.value[`_${prop}`] = objectValue;
          const onObjectValue = item.ons?.objectValue;
          onObjectValue && onObjectValue(objectValue);
        }
      },
      { immediate: true, deep: true }
    );
  }
}
export function generatorOptionsMap(item, runtimeModel, runtimeSchema) {
  const optionProps = item.optionProps || runtimeSchema.value.optionProps;
  const { value = "value", children = "children" } = optionProps || {};
  const prop = item.prop;
  if (prop) {
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
  }
}

export function dealOptionProps(item, runtimeSchema) {
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
    disabled = "disabled",
  } = optionProps || {};
  return {
    autoOptionProps,
    optionProps,
    value,
    label,
    children,
    disabled,
  };
}
// 修改options的value、label、children值， 可在schema或者item配置中关闭， autoOptionProps: false
export function generatorOptionsByOptionProps(
  item,
  runtimeModel,
  runtimeSchema
) {
  const { autoOptionProps, optionProps, value, label, children, disabled } =
    dealOptionProps(item, runtimeSchema);
  if (autoOptionProps) {
    watchEffect(() => {
      if (item?.options?.length) {
        item.options = convertListValueLabel(item.options, {
          value,
          label,
          children,
          disabled,
        });
      }
    });
  }
}

export const deleteValueOnHiddenFunc = (item, runtimeModel, runtimeSchema) => {
  const deleteValueOnHidden = getNotUndefinedValueByOrder([
    item.deleteValueOnHidden,
    runtimeSchema.value.deleteValueOnHidden,
    globalConfig.deleteValueOnHidden,
    true,
  ]);
  if (item.show === false) {
    if (deleteValueOnHidden) {
      if (item.prop) {
        const { k, o } = getPropByPath(runtimeModel.value, item.prop, true);
        del(o, k);
      }
      if (item.list)
        item.list.forEach((conf) => {
          const { k, o } = getPropByPath(runtimeModel.value, conf.prop, true);
          del(o, k);
        });
    }
  } else {
    const resetShowWithDefaultValue = getNotUndefinedValueByOrder([
      item.resetShowWithDefaultValue,
      runtimeSchema.value.resetShowWithDefaultValue,
      globalConfig.resetShowWithDefaultValue,
      true,
    ]);
    updateValue({
      prop: item.prop,
      model: runtimeModel,
      value: getDefaultValue(
        item,
        runtimeModel,
        runtimeSchema,
        resetShowWithDefaultValue,
        true
      ).value,
    });
  }
};
export function dealWithDeleteValueOnHidden(item, runtimeModel, runtimeSchema) {
  watch(
    () => [item.show],
    () => {
      deleteValueOnHiddenFunc(item, runtimeModel, runtimeSchema);
    },
    { immediate: true, deep: true }
  );
}
export function rewriteItemListeners(item, runtimeModel, runtimeSchema) {
  const ons = item?.ons ?? {};
  Object.keys(ons).forEach((key) => {
    const originOn = ons[key];
    ons[key] = (...resets) => {
      const mayHasInnerArs = resets.at(-1)?.model !== undefined;
      if (!mayHasInnerArs) {
        const _updateValue = (val) => {
          updateValue({ prop: item.prop, model: runtimeModel, value: val });
        };
        resets.push({
          model: runtimeModel,
          item,
          schema: runtimeSchema,
          updateValue: _updateValue,
        });
      }
      originOn(...resets);
    };
  });
  item.ons = ons;
}

// export function generatorMixTypeValidate(
//   item,
//   runtimeModel,
//   runtimeSchema,
//   elFormRef
// ) {
//   // 只处理Mix类型的多对一格式，如果未配置prop择按照正常表单执行，只处理布局
//   if (item.type === "Mix" && item.prop) {
//     // 子表单指定 required 为 false，则不会触发验证
//     if (item.required) {
//       item.list.map((child) => {
//         child.trigger = child.trigger || item.trigger;
//         child.validator = child.validator
//           ? (rule, value, callback) => {
//               item.validator(
//                 rule,
//                 value,
//                 callback,
//                 child,
//                 runtimeModel,
//                 elFormRef
//               );
//             }
//           : (rule, value, callback) => {
//               callback();
//               // 触发父级验证
//               elFormRef.value.validateField(item.prop);
//             };
//         return child;
//       });
//       item.rules = [
//         {
//           trigger: rule.trigger,
//           validator(rule, value, callback) {
//             if (!value) {
//               return callback(new Error(message));
//             }
//             // 只验证必填的子表单
//             const requiredChildrenProps = item.list
//               .filter((child) => child.required !== false)
//               .map((child) => child.prop);
//             const values = requiredChildrenProps.reduce((acc, prop) => {
//               acc.push(value[prop]);
//               return acc;
//             }, []);
//             if (item.validator) {
//               item.validator(
//                 rule,
//                 value,
//                 callback,
//                 item,
//                 runtimeModel,
//                 elFormRef
//               );
//             } else if (!values?.length) {
//               callback(new Error(message));
//             } else if (
//               values.some((v) => {
//                 if (Array.isArray(v)) return !v?.length;
//                 return [null, undefined, ""].includes(v);
//               })
//             ) {
//               callback(new Error(message));
//             } else {
//               if (regexp) {
//                 if (regexp.test(value)) {
//                   callback();
//                 } else {
//                   callback(new Error(message));
//                 }
//               } else {
//                 callback();
//               }
//             }
//           },
//         },
//       ];
//     }
//   }
// }
