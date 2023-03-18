import { computed, watch, set } from "vue";
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
    return computed(() => (item.value.label ? item.value.label + symbol : ""));
  }
  return {
    label,
  };
}

export function proxyItem(list, index, item, model) {
  const proxyItem = new Proxy(item, {
    get(target, prop) {
      if (
        functionalProps.includes(prop) &&
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

export function generatorRules(item, model) {
  const rule = {};
  rule.trigger = item.trigger || ["change", "blur"];
  if (item.required) {
    const message = item?.message ?? `${item?.label} 必填`;
    const regexp = item.regexp;
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
      item.validator(rule, value, callback, item, model);
    };
  }
  item.rules = item.rules || item.required || item.validator ? [rule] : [];
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
      set(item, "options", opts);
    });
  }
}

export function generatorReactiveModelPropsDefaultValue(item, runtimeModel) {
  item.prop &&
    set(
      runtimeModel.value,
      item.prop,
      realTypeEqual(runtimeModel.value[item.prop], "Undefined")
        ? runtimeModel.value[item.prop]
        : realTypeEqual(item.defaultValue, "Undefined")
        ? null
        : item.defaultValue
    );
}
