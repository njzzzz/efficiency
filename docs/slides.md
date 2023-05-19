---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: "text-center"
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
info: |
  @slacking/form 配置式表单  
  @slacking/table  配置式表格，支持表格型表单  
  @slacking/adapter 内置组件，提供开箱即用的element-ui表单支持
# persist drawings in exports and build
drawings:
  persist: false
# page transition
transition: slide-left
# use UnoCSS
css: unocss
hideInToc: true
---

# 欢迎使用

@slacking/\* 系列工具主要用于使用配置式的形式快速开发迭代中后台操作系统

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    按空格键继续查看使用说明<carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:edit />
  </button>
  <a href="https://github.com/slidevjs/slidev" target="_blank" alt="GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---
hideInToc: true
---

# 目录

<Toc></Toc>


---

# @slacking/from

主要集成了常用的表单设置

- 提供了 composition-api 的使用方式
- 支持表单项的依赖
- 同时支持项目全局的统一配置支持一个针对单个表单的特殊设置
- 自定义表单模版支持（readonly、disabled 和默认状态下的组件均可自定义）
- 无需复杂配置，开箱即用
- 丰富的个性化配置

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Here is another comment.
-->

---

# 开始使用  

- 安装

```bash 
npm i @slacking/form @slacking/shared @slacking/table @slacking/adapter --save
```

- 使内置的element-ui组件，在入口文件进行注册

```js
import { elementUiRegister } from "@slacking/adapter";
elementUiRegister();
```

- typescript支持

项目中创建 `types/@slacking/form/index.d.ts` 文件, 写入如下内容, 用来拓展 `type`

```ts
import "@slacking/form";
import { AdapterElementUI } from "@slacking/adapter";
declare module "@slacking/form" {
  export interface CustomFormItemProperties {
    type: AdapterElementUI;
  }
}
```

---

## 自定义组件

自定义组件可以传入三种状态 readonly disabled 和默认状态，当然你也可以只传入默认状态下的组件  
然后在组件中自行处理 readonly 和disabled状态的渲染逻辑

- 创建自定义组件说明

- 表单的属性均会传入组件的attrs中
- 表单项的值可以通过attrs.value获取
- 修改表单model值你需要emit("input")
- 你可以通过inject获取form的schema和model

```js
import { globalFormProviderKey } from "@slacking/shared";
const { model, schema, topUtils } = inject(globalFormProviderKey)
```

---

## 一个自定义组件示例
```vue {all|3,11|12,13|14,16-20}
<template>
  <Cascader
    v-bind="$attrs" // 你可以将外部配置的属性直接传递给组件, $attrs包含了当前表单项的所有属性
    :value="runtimeValue"
    @input="updateModel"
  />
</template>
<script setup>
import { computed, defineEmits, ref, useAttrs, useListeners, watch } from "vue";
import { Cascader } from "element-ui";
const attrs = useAttrs();
// 表单项的值可以通过attrs.value获取
const runtimeValue = ref(attrs.value);
const emit = defineEmits(["input"]);
const updateModel = ($event) => {
  // 修改表单model值你需要emit("input", val)
  emit(
    "input",
    attrs.multiple ? $event.map((item) => item.at(-1)) : $event.at(-1)
  );
};
</script>

```

---

## 表单全局配置及参数说明

```js
import { setGlobalFormConfig } from "@slacking/shared"
setGlobalFormConfig({
  maxLen: 100,
  minLen: false,
  autoOptionProps: true,
  labelPosition: "left",
  filterable: true,
  clearable: true,
  size: "small",
  deleteValueOnHidden: true,
  resetShowWithDefaultValue: true,
  defaultRender: "Input",
  hideLabelText: false,
  hideRequiredAsterisk: false,
  renderWithoutFormItem: false,
})

```

---

## 具体参数说明

```ts
  /**
   * 表单项值最大长度 false为不限制
   * @default 100
   */
  maxLen: number | false;
  /**
   * 表单项值最小长度 false为不限制
   * @default false
   */
  minLen: number | false;
  /**
   * 配置了 optionProps 的表单项是否自动转换options的value、label、children
   * @default true
   */
  autoOptionProps: boolean;
  /**
   * 是否开启全局表单项可搜索过滤
   * @default true
   */
  filterable: boolean;
```

---

```ts

  /**
   * 是否开启全局表单可清空
   * @default true
   */
  clearable: boolean;
  /**
   * 表单的size 需要表单支持
   * @default 'small'
   */
  size: string;
  /**
   * 表单隐藏时删除值
   * @default true
   */
  deleteValueOnHidden: boolean;
  /**
   * 表单被隐藏后再展示的时候使用defaultValue,如果设置为false则置为null如果多选则置为[]
   * @default true
   */
  resetShowWithDefaultValue: boolean;
  /**
   * 在表单项不配置type字段时 默认渲染的type 需要已经注册过
   * @default 'Input'
   */
  defaultRender: string;
```

---

```ts

  /**
   * 是否隐藏label文字
   * @default false
   */
  hideLabelText: boolean;
  /**
   * 是否隐藏必填的星号
   * @default false
   */
  hideRequiredAsterisk: boolean;
  /**
   * 是否只渲染表单组件，不使用formItem包裹
   * @default false
   */
  renderWithoutFormItem: boolean;
  /**
   * label的位置，需要表单组件支持
   * @default 'left'
   */
  labelPosition: string;
  /**
   * readonly 状态展示的文字
   * @param {ReadonlyFormatterParams} args
   * @returns  {*}
   */
  readonlyFormatter?: (args: ReadonlyFormatterParams) => any;

```

---

## 使用表单

在jsx中使用

```jsx
import { defineComponent, model } from "vue"
import { useForm, defineFormSchema, FormItemRender } from "@slacking/form";
export default defineComponent({
  setup(){
    const model = ref({})
    const { Form, formData, formRef, schema, getFullValue } = useForm()
    const schema = defineFormSchema({
      list: [
        {
          type: "Cascader",
          label: 'Cascader',
          required: true
        },
        {
          label: '默认Input'
        }
      ]
    })
    return () => <Form schema={schema} props={{model: model.value}}></Form>
  }
})

```

---

在vue文件中使用

```vue
<template>
  <Form :schema="schema" :model="model"></Form>
</template>
<script>
import { defineComponent, model } from "vue"
import { useForm, defineFormSchema, FormItemRender } from "@slacking/form";
const { Form } = useForm()
export default {
  components: { Form },
  data(){
    return {
      model: {},
      schema: defineFormSchema({
        list: [
          {
            type: "Cascader",
            label: 'Cascader',
          },
          {
            label: '默认Input'
          }
        ]
      })
    }
  }
}
</script>
```

---

## 表单schema参数说明

和globalFormConfig参数基本一致，但优先级更高

---

## 表单项参数说明

表单项的配置优先级最高
```ts
  type?: CustomFormItemProperties extends Record<"type", infer T> ? T : string;
  prop?: string;
  label?: string;
  /**
   * 默认值，优先级没有直接传入的model高
   */
  defaultValue?: any;
  /**
   * 表单验证使用的正则
   */
  regexp?: RegExp;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 触发验证的trigger 需要表单支持
   */
  trigger?: string | any[];

```

---

```ts

  /**
   * 验证出错的message
   */
  message?: string;
  /**
   * 仅作为布局类型（有list配置的均为布局类型）时使用，需要col组件支持
   */
  gutter?: number;
  filterable?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  /**
   * 是否展示
   */
  show?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  maxLen?: number | false; //最大长度 默认100
  minLen?: number | false; // 最小长度 默认false
  /**
   * 仅作为布局类型（有list配置的均为布局类型）时使用，需要col组件支持
   */
  align?: string;
```

---

```ts

  /**
   * 仅作为布局类型（有list配置的均为布局类型）时使用，需要col组件支持
   */
  justify?: string;
  resetShowWithDefaultValue?: boolean;
  deleteValueOnHidden?: boolean;
  /**
   * 远程获取options选择项
   * @param {Ref<any>} model
   * @param {FormItem} item
   * @returns
   */
  asyncOptions?: (model: Ref<any>, item: FormItem) => unknown;
  /**
   * value label children 键值映射
   */
  optionProps?: Partial<OptionProps>;
  /**
   * 同步的options选择项
   */
  options?: any[];
  hideLabelText?: boolean;

```

---

```ts

  /**
   * 由于参数平铺，所以可能有属性重名，如果有重名则配置到props里面，暂时支持了type重名，如有其他重名参数，自行在表单项组件中处理
   */
  props?: Record<string, any>;
  /**
   * 仅作为布局类型（有list配置的均为布局类型）时使用，需要col组件支持 优先级比直接平铺属性高
   */
  colAttrs?: Record<string, any>;
  /**
   * 仅作为布局类型（有list配置的均为布局类型）时使用，需要form-item组件支持 优先级比直接平铺属性高
   */
  formItemAttrs?: Record<string, any>;
  renderWithoutFormItem?: boolean;
  /**
   * 在必填的情况下隐藏前面的必填星号
   */
  hideRequiredAsterisk?: boolean;
  /**
   * 表单的互相依赖
   */
  dependOn?: Record<string, DependOnOptions["handler"] | DependOnOptions>;
  list?: FormItem[];
  
```

---

```ts
readonlyFormatter?: (args: {
    item: FormItem;
    model: Ref<any>;
    schema: Ref<Schema>;
    value: any;
    getFullValue: (prop: any) => any;
    readonlyRender: () => unknown;
  }) => any;
  /**
   * 插槽
   */
  scopedSlots?: Record<
    string,
    (args: {
      model: Ref<any>;
      item: Ref<FormItem>;
      schema: Ref<Schema>;
      /**
       * 内部处理过的item，主要用于在外部自行渲染form-item的情况
       */
      dItem: Ref<FormItem>;
      getFullValue: (prop: any) => any;
    }) => any
  >;
```

---

```ts
  ons?: Record<
    string,
    (
      val: any,
      opts: {
        model: Ref<any>;
        item: Ref<FormItem>;
        schema: Ref<Schema>;
        updateValue: (val: any) => void;
        getFullValue: (prop: any) => any;
      }
    ) => unknown
  >;
  /**
   * 继承validate.js的配置需要组件的支持，目前支持element-ui
   */
  validator?: (
    rule: any,
    value: any,
    callback: any,
    item: FormItem,
    model: Ref<any>,
    topUtils: { getFullValue: (prop: any) => any }
  ) => any;
```
