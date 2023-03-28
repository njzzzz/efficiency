import Vue from "vue";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import { elementUiRegister } from "@slacking/form/src/element-ui";
Vue.config.productionTip = false;
elementUiRegister();
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
