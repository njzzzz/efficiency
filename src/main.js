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
} from "element-ui";
import Select from "@/components/Select.vue";
import App from "./App.vue";
import router from "./router";
import { useFormRegister } from "./components/form/useFormRegister";

Vue.config.productionTip = false;
const { registerComponents } = useFormRegister();
registerComponents([
  { name: "AnyInput", component: Input },
  { name: "AnyInputNumber", component: InputNumber },
  { name: "AnyRadio", component: Radio },
  { name: "AnySelect", component: Select },
  { name: "Form", component: Form },
  { name: "FormItem", component: FormItem },
  { name: "Row", component: Row },
  { name: "Col", component: Col },
]);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
