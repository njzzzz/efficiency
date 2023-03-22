export const convertListValueLabel = (
  list = [],
  from = { value: "value", label: "label", children: "children" },
  to = { value: "value", label: "label", children: "children" }
) => {
  let stack = [...list];
  let item = stack.pop();
  while (item) {
    item[to.value] = item[from.value];
    item[to.label] = item[from.label];
    item[to.children] = item[from.children];
    if (item[from.children]) {
      stack = [...stack, ...item[from.children]];
    }
    item = stack.pop();
  }
  return list;
};
export const convertListToMap = (
  list = [],
  { value = "value", children = "children" }
) => {
  const result = {};
  let stack = [...list];
  let item = stack.pop();
  while (item) {
    result[item[value]] = item;
    if (item[children]) {
      stack = [...stack, ...item[children]];
    }
    item = stack.pop();
  }
  return result;
};

export function undefinedAndTrueAsTrue(val) {
  if (Array.isArray(val)) {
    return val.every((item) => item === undefined || item === true);
  } else {
    return val === undefined || val === true;
  }
}
