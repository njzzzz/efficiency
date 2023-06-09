import {
  Input,
  InputNumber,
  Radio,
  Form,
  FormItem,
  Row,
  Col,
  Switch,
  Slider,
  Rate,
  ColorPicker,
  Table,
  TableColumn,
} from "element-ui";
import Select from "./Select/index.vue";
import Cascader from "./Cascader/index.vue";
import SelectTree from "./SelectTree/index.vue";
import TimeSelect from "./TimeSelect/index.vue";
import DatePicker from "./DatePicker/index.vue";
import Mix from "./Mix";
import { useFormRegister } from "@slacking/shared";
export function elementUiRegister() {
  const { registerComponents } = useFormRegister();
  registerComponents([
    { name: "Input", component: Input },
    { name: "InputNumber", component: InputNumber },
    { name: "Radio", component: Radio },
    { name: "Select", component: Select },
    { name: "Cascader", component: Cascader },
    { name: "SelectTree", component: SelectTree },
    { name: "TimeSelect", component: TimeSelect },
    { name: "DatePicker", component: DatePicker },
    { name: "Switch", component: Switch },
    { name: "Slider", component: Slider },
    { name: "Rate", component: Rate },
    { name: "ColorPicker", component: ColorPicker },
    // 只做布局使用
    {
      name: "Mix",
      component: Mix,
      readonlyComponent: Mix,
      disabledComponent: Mix,
    },
    // 以下name不可以修改
    { name: "Form", component: Form },
    { name: "FormItem", component: FormItem },
    { name: "Row", component: Row },
    { name: "Col", component: Col },
    { name: "Table", component: Table },
    { name: "TableColumn", component: TableColumn },
  ]);
}
export type AdapterElementUI =
  | "Input"
  | "InputNumber"
  | "Radio"
  | "Select"
  | "Cascader"
  | "SelectTree"
  | "TimeSelect"
  | "DatePicker"
  | "Switch"
  | "Slider"
  | "Rate"
  | "ColorPicker"
  | "Mix";
