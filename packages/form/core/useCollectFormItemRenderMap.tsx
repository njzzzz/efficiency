import { defineComponent, onRenderTriggered, useAttrs } from "vue";
import FormItemWithMix from "../components/FormItemWithMix";
export function useCollectFormItemRenderMap({ runtimeSchema }) {
  const getRenderMap = () => {
    return (
      runtimeSchema?.value?.list?.length &&
      runtimeSchema.value.list.reduce((acc, item, index) => {
        const ItemRender = defineComponent({
          setup() {
            const attrs = useAttrs();
            return () => (
              <FormItemWithMix
                item={{ ...item, ...attrs }}
                key={item?.prop || item?.list?.[0]?.prop || index}
              ></FormItemWithMix>
            );
          },
        });
        if (item.prop !== undefined) {
          acc[item.prop] = ItemRender;
        }
        return acc;
      }, {})
    );
  };
  return {
    getRenderMap,
  };
}
