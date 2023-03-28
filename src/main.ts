import Vue from "vue";

import "element-ui/lib/theme-chalk/index.css";
import {
  Input,
  InputNumber,
  Radio,
  Form,
  FormItem,
  Row,
  Col,
  Table,
  TableColumn,
  Cascader,
} from "element-ui";
import Select from "@/components/Select.vue";
import App from "./App.vue";
import router from "./router";
import { useFormRegister } from "./components/form/useFormRegister";
import "./components/advance-form";
Vue.config.productionTip = false;
const { registerComponents } = useFormRegister();
registerComponents([
  { name: "AnyInput", component: Input },
  { name: "AnyInputNumber", component: InputNumber },
  { name: "AnyRadio", component: Radio },
  { name: "AnySelect", component: Select },
  { name: "AnyCascader", component: Cascader },
  // 以下name不可以修改
  { name: "Table", component: Table },
  { name: "TableColumn", component: TableColumn },
]);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
