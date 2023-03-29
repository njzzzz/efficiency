import Vue from "vue";
import { Table, TableColumn } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import { elementUiRegister } from "@slacking/form";
import { registerComponents } from "@slacking/shared";
Vue.config.productionTip = false;
elementUiRegister();
registerComponents([
  {
    name: "Table",
    component: Table,
  },
  {
    name: "TableColumn",
    component: TableColumn,
  },
]);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
