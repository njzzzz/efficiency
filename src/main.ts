import Vue from "vue";
import "./normalize.css";
import "./index.scss";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import { elementUiRegister } from "@slacking/form";
import "./index.scss";
Vue.config.productionTip = false;
elementUiRegister();
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
