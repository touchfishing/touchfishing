import {
  createRouter,
  // createWebHashHistory,
  createWebHistory,
} from "vue-router";

import Home from "../pages/home.vue";
import Search from "../pages/search.vue";
import Register from "../pages/register.vue";
import Login from "../pages/login.vue";
import Product from "../pages/product.vue";
import User from "../pages/user.vue";
import StoreMng from "../pages/storeManage.vue";
import Cart from "../pages/cart.vue";
import Checkout from "../pages/checkout.vue";
import Order from "../pages/order.vue";
import Test from "../pages/test.vue";
import store from "../store";

const router = createRouter({
  // hash: createWebHashHistory(),
  history: createWebHistory(),
  routes: [
    {
      name: "home",
      meta: {
        title: "摸渔 touchfishing",
      },
      path: "/",
      component: Home,
    },
    {
      name: "search",
      path: "/search",
      meta: {
        title: "搜索结果",
      },
      component: Search,
    },
    {
      name: "login",
      path: "/login",
      meta: {
        title: "登录",
      },
      component: Login,
    },
    {
      name: "register",
      path: "/register",
      meta: {
        title: "注册",
      },
      component: Register,
    },
    {
      name: "product",
      path: "/product",
      meta: {
        title: "goods info",
      },
      component: Product,
    },
    { name: "test", path: "/test", component: Test },
    {
      name: "user",
      path: "/user",
      meta: {
        title: "用户信息",
      },
      component: User,
      // beforeEnter: (to, from, next) => {
      //   if (
      //     store.getters.LoginInfo === false ||
      //     store.getters.LoginInfo === undefined
      //   ) {
      //     next({ name: "home" });
      //   } else {
      //     next();
      //   }
      // },
    },
    {
      name: "storeMng",
      path: "/user/store",
      meta: {
        title: "店铺商品",
      },
      component: StoreMng,
    },
    {
      name: "cart",
      path: "/cart",
      meta: {
        title: "购物车",
      },
      component: Cart,
    },
    {
      name: "checkout",
      path: "/checkout",
      meta: {
        title: "结算",
      },
      component: Checkout,
    },
    {
      name: "order",
      path: "/order",
      meta: {
        title: "订单",
      },
      component: Order,
    },
    // { path: "/about", component: About },
  ],
});

const loginList = ["user", "cart", "checkout", "order"];

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.name === "login") {
    if (store.getters.LoginInfo) {
      next({ name: "home" });
    }
  } else if (loginList.indexOf(to.name) >= 0) {
    if (
      store.getters.LoginInfo === false ||
      store.getters.LoginInfo === undefined
    ) {
      next({ name: "login" });
    }
  } else if (to.name === "storeMng") {
    if (store.state.store === false || store.state.store === undefined) {
      next({ name: "home" });
    }
  }
  next();
});

export default router;
