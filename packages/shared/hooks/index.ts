import { computed, useAttrs } from "vue";
/**
 * 重名的属性需要在props字段进行配置
 * 如：组件自身属性的type和表单设置的type重复，需要过滤掉
 */
export function useOverrideProps() {
  const attrs = useAttrs();
  const runtimeAttrs = computed(() => {
    const { type, ...otherProps } = attrs;
    const coveredProps = otherProps.props ?? ({} as any);
    return { ...otherProps, ...coveredProps };
  });

  return {
    runtimeAttrs,
    attrs,
  };
}
