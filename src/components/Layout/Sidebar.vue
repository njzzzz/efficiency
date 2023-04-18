<template>
  <div class="layout">
    <Menu
      mode="horizontal"
      background-color="#378BF1"
      text-color="#fff"
      active-text-color=""
      :default-active="activatedMenu"
      :menus="menus"
      @select="activeMenu"
    >
    </Menu>
    <div class="main" ref="layoutRef">
      <Menu
        class="left-menu"
        :default-active="activatedMenu"
        :menus="menus"
        @select="activeMenu"
      >
      </Menu>
      <router-view class="router-view"></router-view>
      <Popover
        v-show="activatedMenu === '/form'"
        ref="dragRef"
        class="drag"
        trigger="click"
        placement="left"
        popper-class="test-form"
        :visible-arrow="false"
      >
        <Form :schema="schema" :model="model"></Form>
        <template #reference>
          <Button type="text" style="margin: auto">TEST_FORM</Button>
        </template>
      </Popover>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { Popover, Button } from "element-ui";
import { onMounted, provide, ref, watch } from "vue";
import Drag from "./Drag";
import { useRouter, useRoute } from "vue-router/composables";
import { useForm } from "@slacking/form";
import Menu from "@/components/Menu/index.vue";
import menus from "./SideBarConfig";
import FormSchema from "./FormSchema";
const router = useRouter();
const route = useRoute();
const layoutRef = ref();
const dragRef = ref();
const activatedMenu = ref("");
const { Form } = useForm();
const model = ref({
  readonly: false,
  disabled: false,
  labelPosition: "left",
  labelWidth: "120px",
  maxLen: "",
  minLen: "",
  autoOptionProps: true,
  size: "small",
  inline: false,
  gutter: 16,
  symbol: ":",
  filterable: true,
  clearable: true,
  deleteValueOnHidden: true,
  resetShowWithDefaultValue: false,
  optionProps: JSON.stringify(
    {
      value: "value",
      label: "label",
      children: "children",
    },
    null,
    2
  ),
  hideLabelText: false,
  hideRequiredAsterisk: false,
});
const schema = ref(FormSchema);
provide("TEST_FORM", {
  formSchema: schema,
  formModel: model,
});
const activeMenu = (index) => {
  if (activatedMenu.value === index) return;
  router.push(index);
};
watch(
  () => route.fullPath,
  () => {
    activatedMenu.value = route.fullPath;
  },
  { immediate: true }
);
onMounted(() => {
  //
  new Drag(dragRef.value.$el, layoutRef.value, { left: "90%", top: "80%" });
});
</script>
<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .main {
    flex: 1;
    display: flex;
    overflow: auto;
    .left-menu {
      width: 260px;
      height: 100%;
    }
    .router-view {
      overflow: auto;
      padding: 20px;
      flex: 1;
      box-sizing: border-box;
    }
    .drag {
      z-index: 1000;
      display: inline-flex;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #a3acf1;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
<style>
.test-form {
  overflow: auto;
  height: 70%;
  width: 600px;
}
</style>
