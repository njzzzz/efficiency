import { getNotUndefinedValueByOrder } from "@slacking/shared";
import { getGlobalTableConfig } from "@slacking/shared";
import { set } from "vue";
const globalTableConfig = getGlobalTableConfig();

export function genRuntimeFormProp({
  prop,
  dataIndex,
  columnIndex,
  list = [],
}) {
  const generatedProp = [];

  if (dataIndex !== undefined) {
    generatedProp.push(`dataIndex=${dataIndex}`);
  }
  if (columnIndex !== undefined) {
    generatedProp.push(`columnIndex=${columnIndex}`);
  }
  if (list?.length) {
    generatedProp.push(
      `list=${list
        .map((item) =>
          item.prop !== undefined ? encodeURIComponent(item.prop) : item.prop
        )
        .filter((prop) => prop !== undefined)
        .join(",")}`
    );
  }
  const propStr = generatedProp.join("&");
  if (prop !== undefined) {
    prop = `prop=${prop}&${propStr}`;
  } else {
    prop = propStr;
  }
  return prop;
}
