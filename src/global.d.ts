import "@slacking/form";
import { AdapterElementUI } from "@slacking/adapter";
declare module "@slacking/form" {
  export interface CustomFormItemProperties {
    type: AdapterElementUI | "a";
  }
}
