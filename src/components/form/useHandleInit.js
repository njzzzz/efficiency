import {
  generatorDependOn,
  generatorOptions,
  generatorReactiveModelPropsDefaultValue,
  generatorRules,
  // proxyItem,
} from "./useConfig";
export function useHandleInit() {
  function init(list, runtimeModel) {
    const unWatches = [];
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      // proxyItem(list, index, item, runtimeModel);
      generatorReactiveModelPropsDefaultValue(item, runtimeModel);
      generatorRules(item, runtimeModel);
      generatorDependOn(item, runtimeModel);
      generatorOptions(item, runtimeModel);
      if (item.list) {
        init(item.list, runtimeModel);
      }
    }
    return unWatches;
  }
  return {
    init,
  };
}
