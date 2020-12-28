import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home/index.vue";
import store from "@/store";

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
        meta: {
          title: "商品",
          icon: "user-solid",
        },
      },
      {
        path: "/categorys",
        component: () => import("@/views/Categorys"),
        meta: {
          title: "商品分类",
          icon: "s-promotion",
        },
      },
      {
        path: "/orders",
        component: () => import("../views/Order/index.vue"),
        meta: {
          title: "销售订单",
          icon: "s-order",
        },
      },
      {
        path: "/roles",
        component: () => import("@/views/Roles"),
        meta: {
          title: "角色",
          icon: "s-custom",
        },
      },
      {
        path: "/menus",
        component: () => import("../components/home/menus.vue"),
        meta: {
          title: "菜单",
          icon: "menu",
        },
      },
      {
        path: "/users",
        component: () => import("@/views/Users"),
        meta: {
          title: "用户管理",
          icon: "user-solid",
        },
      },
      {
        path: "/interfaces",
        component: () => import("../components/home/interfaces.vue"),
        meta: {
          title: "接口",
          icon: "user-solid",
        },
      },
      {
        path: "/datasheets",
        component: () => import("../components/home/datasheets.vue"),
      },
      {
        path: "/records",
        component: () => import("@/views/Records"),
        meta: {
          title: "操作记录",
          icon: "s-open",
        },
      },
      {
        path: "/shops",
        component: () => import("@/views/Shops"),
        meta: {
          title: "商铺",
          icon: "s-shop",
        },
      },
      {
        path: "/purchases",
        component: () => import("../views/Purchase/index.vue"),
        meta: {
          title: "采购订单",
          icon: "s-order",
        },
      },
      {
        path: "/suppliers",
        component: () => import("../components/home/suppliers.vue"),
        meta: {
          title: "供应商",
          icon: "user-solid",
        },
      },
      {
        path: "/tasks",
        component: () => import("../components/home/tasks.vue"),
        meta: {
          title: "定时任务",
          icon: "s-flag",
        },
      },
      {
        path: "/inventory",
        component: () => import("../components/home/inventory.vue"),
        meta: {
          title: "库存",
          icon: "s-goods",
        },
      },
      {
        path: "/client",
        component: () => import("../components/home/client.vue"),
        meta: {
          title: "客户详情",
          icon: "user-solid",
        },
      },
      {
        path: "/dashboard",
        component: () => import("../views/Dashboard/index.vue"),
        meta: {
          title: "首页",
          icon: "s-home",
        },
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

let router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title; // 路由跳转更新浏览器标题
    store.state.pageInfo = to.meta; // 路由跳转更新页面顶栏标题
  }
  next();
});

export default router;
