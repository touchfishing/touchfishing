// import { createApp } from "vue";
import { createStore } from "vuex";
// import AES from "crypto-js/aes";
// import ENC from "crypto-js/enc-hex";
// import ENCUTF8 from "crypto-js/enc-utf8";

import { crypt_, cryptCookie, decryptCookie } from "./crypt.js";

import {
  setCookieLocal,
  getCookieLocal,
  removeCookieLocal,
} from "../plugins/storage.js";

import CartManage from "./cart.js";
import Settings from "./settings.js";
import Languages from "./languages.js";

// async function crypt_(txt, saltRounds) {
//   let a = bcrypt.hashSync(txt, saltRounds);
//   console.log("en", txt, a);
//   console.log(decrypt_(txt, a));
//   return a;
// }
// async function decrypt_(txt, hash) {
//   // txt is hash from db!!!
//   return bcrypt.compareSync(txt, hash);
// }

const loginKey = "userinfo",
  storeKey = "storeinfo";

// function crypt_(txt, st, iv) {
//   return AES.encrypt(txt, ENC.parse(st), { iv: ENC.parse(iv) }).toString();
// }

// function cryptCookie(txt) {
//   return AES.encrypt(txt, kkk, { iv: iiv }).toString();
// }
// function decryptCookie(ha) {
//   return AES.decrypt(ha, kkk, { iv: iiv }).toString(ENCUTF8);
// }

// function getCookie(cname) {
//   let name = cname + "=";
//   let decodedCookie = decodeURIComponent(document.cookie);
//   let ca = decodedCookie.split(';');
//   for(let i = 0; i <ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) == ' ') {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// }

// console.log(JSON.parse(decryptCookie(getCookieLocal(cryptCookie(cartKey)))));

const checkFunc = function (key, context, who) {
  let tmp = getCookieLocal(cryptCookie(key));
  if (tmp !== undefined) {
    context.commit(who, JSON.parse(decryptCookie(tmp)));
  } else {
    context.commit(who, undefined);
  }
};

const actions = {
  if_pc_view(context, val) {
    context.commit("IF_PC_VIEW", val);
  },
  userLogin(context, val) {
    context.commit("USERLOGIN", val);
  },

  checkLogin(context) {
    checkFunc(loginKey, context, "USERLOGIN");
    checkFunc(storeKey, context, "STOREINFO");
  },
  logout(context) {
    removeCookieLocal(cryptCookie(loginKey));
    context.commit("USERLOGIN", undefined);
    removeCookieLocal(cryptCookie(storeKey));
    context.commit("STOREINFO", undefined);
    CartManage.destroy();
  },

  storeInfo(context, val) {
    context.commit("STOREINFO", val);
  },
};

const mutations = {
  IF_PC_VIEW(state, val) {
    state.ifPC = val;
  },

  URLTO(state, val) {
    if (
      !state.ifPC ||
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      window.location.href = val;
    } else {
      window.open(val);
    }
  },

  USERLOGIN(state, val) {
    if (val === undefined) {
      state.login = false;
      return;
    }
    if (val.avatar.indexOf("/media/users/") >= 0) {
      if (
        val.avatar.indexOf("/icons8-") >= 0 &&
        val.avatar.indexOf(".svg") > 0
      ) {
        val.avatar = val.avatar.replace("/media/users", "");
      } else {
        if (val.avatar.indexOf(state.urlPrefix) < 0)
          val.avatar = state.urlPrefix + val.avatar;
      }
    }
    state.login = val;
    setCookieLocal(cryptCookie(loginKey), cryptCookie(JSON.stringify(val)), 14);
  },

  STOREINFO(state, val) {
    if (val === undefined) {
      state.store = false;
      return;
    }
    state.store = val;
    setCookieLocal(cryptCookie(storeKey), cryptCookie(JSON.stringify(val)), 14);
  },

  SHOPCART(state, val) {
    CartManage.add(val);
  },

  SETTINGS(state, val) {
    Settings.set(val[0], val[1]);
    state.settings = Settings.get();
  },
};

const state = {
  language: Languages,
  settings: Settings.get(),
  saltRounds: 10,
  st: "something I don't know about touchfishing is..",
  iv: "131415161718191a1b1c",
  ifPC: true,
  urlPrefix: "https://tf.mrning.com/api/",
  login: false,
  store: false,
  urlAPI: {
    captcha: "/user/captcha",
    search: {
      title: "search/name/",
      store: "search/shop/",
      tag: "/product/tag/",
    },
    user: {
      validation: "user/validation/",
      login: "user/login",
      logout: "user/logout",
      register: "user/register",
      modify: {
        info: "user/info",
        avatar: "user/avatar",
        password: "user/password",
        reset: "user/reset",
      },
      store: {
        info: "user/shop",
        register: "user/shop/new",
        modify: "user/shop/edit",
        products: {
          list: (b) => `shop/${b}/list`, //!!!!!
          add: () => "product/new",
          detail: () => "product/",
        },
      },
    },
    order: {
      checkout: (p) => `product/${p}/order`,
      list: "user/orders",
      detail: "user/order/",
    },
  },
};

const getters = {
  Cart: () => CartManage.get(),
  CartRemove: () => (a, b, c) => CartManage.remove(a, b, c),
  CartNum: () => (a, b, c, d, e) => CartManage.changeNum(a, b, c, d, e),
  LoginInfo: (s) => s.login,
  LoginSession: (s) => "sessionid=" + s.login.sessionid,
  UrlPrefix: (s) => s.urlPrefix,
  Media: (s) => (a) => s.urlPrefix + a,
  UrlCaptcha: (s) => s.urlPrefix + s.urlAPI.captcha,
  UrlLogin: (s) => s.urlPrefix + s.urlAPI.user.login,
  UrlRegister: (s) => s.urlPrefix + s.urlAPI.user.register,
  UrlLogout: (s) => s.urlPrefix + s.urlAPI.user.logout,
  UrlSearchTitle: (s) => (a) => s.urlPrefix + s.urlAPI.search.title + a,
  UrlSearchStore: (s) => (a) => s.urlPrefix + s.urlAPI.search.store + a,
  UrlSearchTag: (s) => (a) => s.urlPrefix + s.urlAPI.search.tag + a,
  UrlProductId: (s) => (a) =>
    s.urlPrefix + s.urlAPI.user.store.products.detail() + a,
  UrlStore: (s) => (a) => s.urlPrefix + s.urlAPI.user.store[a],
  UrlStoreProducts: (s) => (a, b) =>
    s.urlPrefix + s.urlAPI.user.store.products[a](b),
  UrlOrder: (s) => (a) => s.urlPrefix + s.urlAPI.order[a],
  UrlValid: (s) => (a) => s.urlPrefix + s.urlAPI.user.validation + a,
  UrlCheckout: (s) => (a) => s.urlPrefix + s.urlAPI.order.checkout(a),
  // Encrypt: (s) => async (a) => crypt_(a, s.saltRounds),
  Encrypt: (s) => (a) => crypt_(a, s.st, s.iv),
  // PswCorrect: (s) => async (ipt, db) => decrypt_(db, crypt_(ipt, s.saltRounds)),
  SaveCookie: () => (k, v) =>
    setCookieLocal(cryptCookie(k), cryptCookie(v.toString())),
  GetCookie: () => (k) => getCookieLocal(decryptCookie(k)),
};

const store = createStore({
  actions,
  mutations,
  state,
  getters,
});

export default store;
