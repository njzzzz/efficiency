import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/components/Layout/Sidebar.vue"),
    children: [
      {
        path: "/form",
        name: "form",
        component: () => import("@/views/form"),
      },
      {
        path: "/table-form",
        name: "tableForm",
        component: () => import("@/views/table"),
      },
    ],
    redirect: "/form",
  },
  {
    path: "*",
    redirect: "/form",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
