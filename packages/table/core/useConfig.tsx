import {
  getGlobalTableConfig,
  getNotUndefinedValueByOrder,
} from "@slacking/shared";
const globalTableConfig = getGlobalTableConfig();
export function useInitScopedSlots(column, data, schema) {
  const type = getNotUndefinedValueByOrder([
    column.type,
    schema.defaultRender,
    globalTableConfig.defaultRender,
    "Input",
  ]);
  const ons = {
    input(...args) {
      // 在此处修改data
      console.log("args", args);
    },
  };
  Object.keys(column?.on ?? {}).forEach((key) => {
    const originOn = ons[key];
    ons[key] = (...resets) => {
      originOn(...resets, data, column, schema);
    };
  });
  column.scopedSlots = getNotUndefinedValueByOrder([
    column.scopedSlots,
    {
      default({ row }) {
        // console.log(column.prop);
        return row[column.prop];
      },
    },
  ]);
}

export const VIRTUAL_MODEL_KEY = "virtual";
export function createVirtualModel(model = [], formSchema, formData = {}) {
  if (!model?.length) {
    return formData;
  }
  if (formSchema?.list?.length) {
    formSchema?.list.forEach((schema) => {
      if (schema.list) {
        formData = Object.assign(
          formData,
          createVirtualModel(model, { list: schema.list }, formData)
        );
      } else if (schema.prop !== undefined) {
        const { dataIndex, originProp } = schema.__prop;
        formData[schema.prop] = model[dataIndex][originProp] ?? null;
      }
    });
  }
  return formData;
}
export function genVirtualProp({
  config,
  dataIndex,
  schemaIndex,
  subDeep,
  subIndex,
  changeConfig = true,
}) {
  if (changeConfig) {
    config.prop = `${VIRTUAL_MODEL_KEY}_${config.prop}_${schemaIndex}`;
    if (dataIndex !== null) {
      config.prop += `_${dataIndex}`;
    }
    if (subDeep !== null) {
      config.prop += `_${subDeep}`;
    }
    if (subIndex !== null) {
      config.prop += `_${subIndex}`;
    }
    return config.prop;
  } else {
    let prop = `${VIRTUAL_MODEL_KEY}_${config.prop}_${schemaIndex}`;
    if (dataIndex !== null) {
      prop += `_${dataIndex}`;
    }
    if (subDeep !== null) {
      prop += `_${subDeep}`;
    }
    if (subIndex !== null) {
      prop += `_${subIndex}`;
    }
    return prop;
  }
}

function genVirtualConfig({
  config,
  schemaIndex,
  dataIndex = null,
  subDeep = null,
  subIndex = null,
  formSchemaMap = {},
}) {
  const virtualConfig = {
    ...config,
  };
  virtualConfig.__prop = {
    VIRTUAL_MODEL_KEY,
    schemaIndex,
    dataIndex,
    subDeep,
    subIndex,
  };

  if (virtualConfig.prop) {
    virtualConfig.__prop.originProp = virtualConfig.prop;
    virtualConfig.prop = genVirtualProp({
      config: virtualConfig,
      schemaIndex,
      dataIndex,
      subDeep,
      subIndex,
    });
    virtualConfig.__prop.prop = virtualConfig.prop;
    const originProp = virtualConfig.__prop.originProp;
    if (formSchemaMap[originProp]) {
      formSchemaMap[originProp] = [
        ...formSchemaMap[originProp],
        virtualConfig.__prop,
      ];
    } else {
      formSchemaMap[originProp] = [virtualConfig.__prop];
    }
  }
  if (virtualConfig.list) {
    subDeep = subDeep === null ? 0 : subDeep + 1;
    // 带子节点的必为Mix类型, 如果不带prop则说明是单纯布局类型，带prop则说明是组合类型
    virtualConfig.type = "Mix";
    virtualConfig.list = virtualConfig.list.map((subConfig, subIndex) =>
      genVirtualConfig({
        config: subConfig,
        schemaIndex,
        dataIndex,
        subDeep,
        subIndex,
        formSchemaMap,
      })
    );
  }
  return virtualConfig;
}
export function createVirtualSchema(model, schema) {
  const formSchema = { ...schema };
  const formSchemaMap = {};
  if (formSchema.list?.length) {
    formSchema.list = formSchema.list.reduce((acc, config, schemaIndex) => {
      if (model?.length) {
        model.forEach((data, dataIndex) => {
          acc.push(
            genVirtualConfig({ config, schemaIndex, dataIndex, formSchemaMap })
          );
        });
      } else {
        acc.push(genVirtualConfig({ config, schemaIndex, formSchemaMap }));
      }

      return acc;
    }, []);
  }
  return { formSchema, formSchemaMap };
}
