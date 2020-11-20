import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect: "/index",
    children: [
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: "/detail2",
        component: () => import("../components/UserDetails.vue"),
      },
      {
        path: "/index",
        component: () => import("../components/Index.vue"),
      },
      {
        path: "/commoditys",
        component: () => import("../components/home/commoditys.vue"),
      },
      {
        path: "/categorys",
        component: () => import("@/views/Categorys"),
      },
      {
        path: "/orders",
        component: () => import("../views/Order/index.vue"),
      },
      {
        path: "/roles",
        component: () => import("../components/home/roles.vue"),
      },
      {
        path: "/menus",
        component: () => import("../components/home/menus.vue"),
      },
      {
        path: "/users",
        component: () => import("../components/home/users.vue"),
      },
      {
        path: "/interfaces",
        component: () => import("../components/home/interfaces.vue"),
      },
      {
        path: "/datasheets",
        component: () => import("../components/home/datasheets.vue"),
      },
      {
        path: "/records",
        component: () => import("../components/home/records.vue"),
      },
      {
        path: "/shops",
        component: () => import("@/views/Shops"),
      },
      {
        path: "/purchases",
        component: () => import("../components/home/purchases.vue"),
      },
      {
        path: "/suppliers",
        component: () => import("../components/home/suppliers.vue"),
      },
      {
        path: "/tasks",
        component: () => import("../components/home/tasks.vue"),
      },
      {
        path: "/inventory",
        component: () => import("../components/home/inventory.vue"),
      },
      {
        path: "/client",
        component: () => import("../components/home/client.vue"),
      },
      {
        path: "/dashboard",
        component: () => import("../views/Dashboard/index.vue"),
      },
      {
        path: "/detail",
        component: () => import("../views/Detail/index.vue"),
      },
    ],
  },
  {
    path: "/find",
    name: "Find",
    component: () => import("../views/Find.vue"),
  },
];
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
