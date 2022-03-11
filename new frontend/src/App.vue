<template>
  <v-app>
    <NavBar v-if="navShow" :showSearch="showSearch" />
    <v-btn
      v-show="backbtnShow"
      class="goback-top-btn"
      color="white"
      icon="mdi-chevron-left"
      @click="historyBack"
    ></v-btn>
    <router-view></router-view>
    <AppBar v-if="appShow" />
  </v-app>
</template>

<script>
import ifPcFunc from "./plugins/detectPC.js";
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { checkCookie } from "./plugins/storage.js";
import AppBar from "./components/myAppBar.vue";
import NavBar from "./components/NavBar";

export default {
  name: "App",

  components: {
    AppBar,
    NavBar,
  },
  setup() {
    checkCookie();

    const store = useStore();

    store.dispatch("checkLogin");

    let ifPC = ref(ifPcFunc());
    window.addEventListener("resize", () => {
      ifPC.value = ifPcFunc();
    });

    watch(
      ifPC,
      (e) => {
        store.dispatch("if_pc_view", e);
      },
      { immediate: true }
    );

    const blacklist = [
      "/register",
      "/login",
      "/user/store",
      "/checkout",
      "/product",
    ];
    const whitelist = ["/", "/user", "/product", "/cart", "/order"];

    let appShow = computed({
      get: () => {
        if (ifPC.value) return false;
        if (blacklist.indexOf(window.location.pathname) >= 0) return false;
        return true;
      },
    });
    let navShow = computed({
      get: () => {
        if (ifPC.value && whitelist.indexOf(window.location.pathname) >= 0)
          return true;
        return false;
      },
    });

    let showSearch = ref(window.location.pathname === "/" ? false : true);

    const backlist = ["/product", "/cart", "/order", "/user/store/"];
    let backbtnShow = computed({
      get: () => {
        if (!ifPC.value && backlist.indexOf(window.location.pathname) >= 0)
          return true;
        return false;
      },
    });
    function historyBack() {
      window.history.back();
    }

    return {
      ifPC,
      appShow,
      navShow,
      showSearch,
      backbtnShow,
      historyBack,
    };
  },
};
</script>

<style>
/* customize scroll bar */
* {
  scrollbar-color: #888 transparent; /* thumb and track color */
  scrollbar-width: thin;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}
/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.pointer {
  cursor: pointer;
}

.auto-margin {
  margin: min(25px, 2vw) !important;
}
.auto-margin-x {
  margin-left: min(25px, 2vw) !important;
  margin-right: min(25px, 2vw) !important;
}
.auto-padding {
  padding: min(25px, 2vw) !important;
}
.auto-padding-min {
  padding: min(15px, 1vw) !important;
}
.auto-padding-x {
  padding-left: min(25px, 2vw) !important;
  padding-right: min(25px, 2vw) !important;
}
.auto-padding-y-min {
  padding-top: min(15px, 1vw) !important;
  padding-bottom: min(15px, 1vw) !important;
}
.no-wrap-flex {
  flex-wrap: nowrap !important;
}
.flex-2 {
  flex: 2;
}
.very-center {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.cus-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
}
.cus-flex-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
}
.flex-start-align {
  align-items: flex-start;
}

.justify-space-between {
  justify-content: space-between !important;
}
.justify-center {
  justify-content: center !important;
}

.phone-cart-outer {
  width: 100vw !important;
  left: 0 !important;
  top: 0 !important;
  height: 100vh !important;
}

.goback-top-btn {
  position: fixed;
  left: 5vw;
  top: 5vw;
  opacity: 0.6;
  z-index: 1003;
}
.goback-top-btn-right {
  position: fixed;
  right: 5vw;
  top: 5vw;
  opacity: 0.6;
  z-index: 1000;
}

.opacity-9 {
  opacity: 0.9;
}

.pre-wrap-text {
  white-space: pre-wrap;
}

.transition06 {
  transition: 0.6s;
}
</style>
