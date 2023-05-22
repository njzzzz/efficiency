import short from "short-uuid";
export const convertListValueLabel = (
  list = [],
  from = {
    value: "value",
    label: "label",
    children: "children",
    disabled: "disabled",
  },
  to = {
    value: "value",
    label: "label",
    children: "children",
    disabled: "disabled",
  }
) => {
  let stack = [...list];
  let item = stack.pop();
  while (item) {
    item[to.value] = item[from.value];
    item[to.label] = item[from.label];
    item[to.children] = item[from.children];
    item[to.disabled] = item[from.disabled];
    if (item[from.children]) {
      stack = [...stack, ...item[from.children]];
    }
    item = stack.pop();
  }
  return list;
};
export const convertListToMap = (
  list = [],
  { value = "value", children = "children" },
  withParentAndPath = true,
  parent = null
) => {
  const result = {};
  if (list?.length) {
    for (let index = 0; index < list.length; index++) {
      const item = list[index] as any;
      if (withParentAndPath) {
        item.__parent = parent;
        item.__path = item.__parent
          ? [...item.__parent.__path, item[value]]
          : [item[value]];
      }
      result[item[value]] = item;
      if (item[children]) {
        Object.assign(
          result,
          convertListToMap(
            item[children],
            { value, children },
            withParentAndPath,
            item
          )
        );
      }
    }
  }
  return result;
};

export function getNotUndefinedValueByOrder(arr) {
  return arr.find((item) => item !== undefined);
}

export function undefinedAndTrueAsTrue(val) {
  if (Array.isArray(val)) {
    return val.every((item) => item === undefined || item === true);
  } else {
    return val === undefined || val === true;
  }
}
export function undefinedAndNotNullValueAsTrue(val) {
  if (Array.isArray(val)) {
    return val.every(
      (item) => item === undefined || !["", null].includes(item)
    );
  } else {
    return val === undefined || !["", null].includes(val);
  }
}
export function sid() {
  return short.generate();
}
export function flattenListWithDataIndex(
  list,
  childrenKey = "children",
  parent = null,
  newArr = []
) {
  if (list?.length) {
    list.forEach((item, index) => {
      item.__parent = parent;
      item.__topIndex = parent === null ? index : parent.__topIndex;
      item.__index = index;
      newArr.push(item);
      if (item[childrenKey]) {
        flattenListWithDataIndex(item[childrenKey], childrenKey, item, newArr);
      }
    });
  }

  return newArr;
}

export function realType(may) {
  return Object.prototype.toString.call(may);
}

export function realTypeEqual(may, type) {
  return realType(may) === `[object ${type}]`;
}
export function isEmptyInput(val) {
  return [null, undefined, ""].includes(val);
}
export function isUndef(val) {
  return realTypeEqual(val, "Undefined");
}
export function isNull(val) {
  return realTypeEqual(val, "Null");
}
export function isArray(val) {
  return realTypeEqual(val, "Array");
}
export function isPlainObj(val) {
  return realTypeEqual(val, "Object");
}
export const getValueByPath = function (object, prop) {
  prop = prop || "";
  const paths = prop.split(".");
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};

export function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, ".$1");
  path = path.replace(/^\./, "");

  const keyArr = path.split(".");
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    const key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error("please transfer a valid prop path to form item!");
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null,
  };
}
export function runFns(fns = [], args = []) {
  fns.forEach((fn) => fn(...args));
}
function runListenersEvent(fns, event, args) {
  if (fns) {
    if (isArray(fns)) {
      runFns(fns, args);
    } else {
      fns(...args);
    }
  }
}
function getListenersByEventName(obj, event) {
  return obj[event]?.fns ?? obj[event] ?? null;
}

export function mergeListeners(obj1 = {}, obj2 = {}) {
  const obj = { ...obj1 };
  // listeners可能为数组挂在fns属性下
  Object.keys(obj2).forEach((event) => {
    const fns = getListenersByEventName(obj, event);
    obj[event] = (...args) => {
      runListenersEvent(fns, event, args);
      const obj2Fns = getListenersByEventName(obj2, event);
      runListenersEvent(obj2Fns, event, args);
    };
  });
  return obj;
}

export function isEmptyObj(obj: unknown) {
  return isPlainObj(obj) && Object.keys(obj).length === 0;
}

export const setIfNotUndef = (data = {}, key = "", value) => {
  if (!isUndef(value)) {
    data[key] = value;
  }
};

export function noInputEmptyInArr(arr) {
  return !arr.some((val) => isEmptyInput(val));
}

export const func = () => {};
