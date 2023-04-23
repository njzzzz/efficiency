### @slacking/adapter

element-ui 组件包合集

## 使用

```ts
import { elementUiRegister } from "@slacking/adapter";
elementUiRegister();
```

## 类型提示

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
