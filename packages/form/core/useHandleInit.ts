import {
  generatorDependOn,
  generatorOptions,
  generatorReactiveModelPropsDefaultValue,
  generatorRules,
  dealWithMixTypeValue,
  patchReactiveProps,
  generatorWithObjectValue,
  generatorOptionsByOptionProps,
  dealWithDeleteValueOnHidden,
  deleteValueOnHiddenFunc,
  rewriteItemListeners,
  // proxyItem,
} from "./useConfig";

export function initFormItem(item, runtimeModel, elFormRef, runtimeSchema) {
  // proxyItem(list, index, item, runtimeModel);
  // 此处初始化没有被用户写入schema的属性，将其set为响应式属性，vue3不需要
  // 在此处设置的目的是初始化一次，避免在后面手动set导致二次渲染，造成性能浪费
  // 此处调用顺序不能发生错误
  rewriteItemListeners(item, runtimeModel, runtimeSchema);
  patchReactiveProps(item, runtimeSchema);
  generatorDependOn(
    item,
    runtimeModel,
    runtimeSchema,
    // 因为在dependOn的函数里可能会改model所以需要在执行完callback后再执行一次展示隐藏的逻辑
    deleteValueOnHiddenFunc
  );
  generatorReactiveModelPropsDefaultValue(item, runtimeModel, runtimeSchema);
  generatorWithObjectValue(item, runtimeModel, runtimeSchema);
  dealWithMixTypeValue(item, runtimeModel);
  generatorOptions(item, runtimeModel, runtimeSchema);
  generatorRules(item, runtimeModel, runtimeSchema, elFormRef);
  generatorOptionsByOptionProps(item, runtimeModel, runtimeSchema);
  dealWithDeleteValueOnHidden(item, runtimeModel, runtimeSchema);
  if (item.list) {
    initFormList(item.list, runtimeModel, elFormRef, runtimeSchema);
  }
}

export function initFormList(list, runtimeModel, elFormRef, runtimeSchema) {
  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    initFormItem(item, runtimeModel, elFormRef, runtimeSchema);
  }
}

export function useHandleInit() {
  function init(list, runtimeModel, elFormRef, runtimeSchema) {
    initFormList(list, runtimeModel, elFormRef, runtimeSchema);
  }
  return {
    init,
  };
}
