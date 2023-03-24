import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/form",
    name: "form",
    component: () => import("@/views/form"),
  },
  {
    path: "/table",
    name: "table",
    component: () => import("@/views/table"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
