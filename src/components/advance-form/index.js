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
} from "element-ui";
import Select from "./Select/index.vue";
import Cascader from "./Cascader/index.vue";
import SelectTree from "./SelectTree/index.vue";
import TimeSelect from "./TimeSelect/index.vue";
import DatePicker from "./DatePicker/index.vue";
import { useFormRegister } from "@slacking/form";

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
    // 以下name不可以修改
    { name: "Form", component: Form },
    { name: "FormItem", component: FormItem },
    { name: "Row", component: Row },
    { name: "Col", component: Col },
  ]);
}
