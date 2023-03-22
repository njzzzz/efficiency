import {
  generatorDependOn,
  generatorOptions,
  generatorReactiveModelPropsDefaultValue,
  generatorRules,
  dealWithMixTypeValue,
  patchReactiveProps,
  generatorWithObjectValue,
  generatorOptionsByOptionProps,
  // proxyItem,
} from "./useConfig";
export function useHandleInit() {
  function init(list, runtimeModel, elFormRef, runtimeSchema) {
    for (let index = 0; index < list.length; index++) {
      const item = list[index];

      // proxyItem(list, index, item, runtimeModel);
      // 此处初始化没有被用户写入schema的属性，将其set为响应式属性，vue3不需要
      // 在此处设置的目的是初始化一次，避免在后面手动set导致二次渲染，造成性能浪费
      // 此处调用顺序不能发生错误
      patchReactiveProps(item);
      generatorDependOn(item, runtimeModel);
      generatorReactiveModelPropsDefaultValue(item, runtimeModel);
      generatorWithObjectValue(item, runtimeModel, runtimeSchema);
      dealWithMixTypeValue(item, runtimeModel);
      generatorOptions(item, runtimeModel);
      generatorRules(item, runtimeModel, elFormRef);
      generatorOptionsByOptionProps(item, runtimeModel, runtimeSchema);
      if (item.list) {
        init(item.list, runtimeModel, elFormRef, runtimeSchema);
      }
    }
  }
  return {
    init,
  };
}
