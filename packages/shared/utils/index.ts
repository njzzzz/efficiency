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
  parent = null
) => {
  const result = {};
  if (list?.length) {
    for (let index = 0; index < list.length; index++) {
      const item = list[index] as any;
      item.__parent = parent;
      item.__path = item.__parent
        ? [...item.__parent.__path, item[value]]
        : [item[value]];
      result[item[value]] = item;
      if (item[children]) {
        Object.assign(
          result,
          convertListToMap(item[children], { value, children }, item)
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
