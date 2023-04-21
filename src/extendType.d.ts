import "@slacking/form";
declare module "@slacking/form" {
  export interface ExtendedFormItem {
    type: "Inputs" | "a" | "b";
  }
}
