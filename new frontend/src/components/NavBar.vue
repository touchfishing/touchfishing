<template>
  <v-app-bar density="compact" absolute>
    <v-app-bar-nav-icon
      v-if="showornot"
      @click.stop="showornot"
    ></v-app-bar-nav-icon>
    <v-app-bar-title v-show="!simpleView" class="pointer" @click="toHome">
      <div class="app-bar-icon-custom">
        <img src="/fishicon.svg" />{{ barInfo.barInfo.title }}
      </div>
    </v-app-bar-title>

    <template v-if="showSearch">
      <!-- <v-divider inset vertical></v-divider> -->
      <SearchBar :inNav="true" />
      <!-- <v-divider inset vertical></v-divider> -->
    </template>
    <v-spacer v-else></v-spacer>

    <template v-if="!simpleView">
      <v-divider inset vertical></v-divider>
      <v-btn @click="settingsToggle" flat icon="mdi-cog"></v-btn>
      <template v-if="hasLogin.state === false">
        <v-btn class="mr-1 ml-3" color="primary" plain @click="toSignup">
          <v-icon left icon="mdi-account-plus"></v-icon>
          <span>{{ barInfo.barInfo.signup }}</span>
        </v-btn>
        <v-btn class="mr-3 ml-1" color="primary" plain @click="toggleLogin(1)">
          <v-icon left icon="mdi-account-settings"></v-icon>
          <span>{{ barInfo.barInfo.login }}</span>
        </v-btn>
      </template>
      <template v-else>
        <v-btn
          class="mr-1 ml-3"
          color="primary"
          v-if="!ifPage('cart')"
          plain
          @click="openPage('cart')"
        >
          <v-icon left icon="mdi-cart"></v-icon>
          <span>{{ barInfo.barInfo.cart }}</span>
        </v-btn>
        <v-btn
          class="mr-3 ml-1"
          color="primary"
          plain
          @click="openPage('order')"
          v-if="!ifPage('order')"
        >
          <v-icon left icon="mdi-form-select"></v-icon>
          <span>{{ barInfo.barInfo.order }}</span>
        </v-btn>
        <v-avatar size="large"
          ><img
            style="width: 50px"
            class="avatar"
            :alt="hasLogin.info.name"
            :src="hasLogin.info.avatar"
            @click="hasLogin.info.func"
        /></v-avatar>
      </template>
    </template>
  </v-app-bar>
  <v-navigation-drawer class="pa-4" v-model="settingsMenu">
    <DefSettings />
  </v-navigation-drawer>
  <div class="my-login-outer" v-if="showLogin" @click.self="toggleLogin(0)">
    <Login :exit="toggleLogin" />
  </div>
</template>

<script>
import { reactive, ref, watch, computed, onBeforeMount } from "vue";
import { useStore } from "vuex";
import SearchBar from "./BigSearch.vue";
import Login from "../widgets/login.vue";
import DefSettings from "../components/settings.vue";
export default {
  name: "NavBar",
  components: { SearchBar, Login, DefSettings },
  props: ["showSearch", "simpleView", "showornot"],
  setup() {
    const store = useStore();
    const barInfo = reactive({
      barInfo:
        store.state.language[store.state.settings.language].navBar.barInfo,
    });
    watch(
      () => store.state.settings.language,
      (e) => {
        barInfo.barInfo = store.state.language[e].navBar.barInfo;
      }
    );

    /* the settings menu */
    let settingsMenu = ref(false);
    function settingsToggle() {
      settingsMenu.value = !settingsMenu.value;
    }

    let hasLogin = reactive({
      state: false,
      info: {},
    });
    let storelogin = computed(() => store.getters.LoginInfo);
    function storeLoginInfo(e) {
      if (e === false) {
        hasLogin.state = false;
        hasLogin.info = {};
      } else {
        hasLogin.state = true;
        hasLogin.info = {
          name: e.uname,
          avatar: e.avatar,
          func: () => {
            window.location.href = "/user";
          },
        };
      }
    }
    watch(
      () => storelogin,
      (e) => {
        storeLoginInfo(e);
      }
    );
    onBeforeMount(() => {
      storeLoginInfo(store.getters.LoginInfo);
    });

    let showLogin = ref(false);

    function toHome() {
      window.location.href = "/";
    }
    function toSignup() {
      window.location.href = "/register";
    }
    function toggleLogin(s) {
      if (s === 0 || s === undefined || s === null) showLogin.value = false;
      else showLogin.value = true;
    }
    function openPage(s) {
      store.commit("URLTO", s);
    }
    function ifPage(s) {
      return window.location.pathname.indexOf("/" + s) === 0;
    }

    return {
      barInfo,
      toHome,
      showLogin,
      toggleLogin,
      toSignup,
      hasLogin,
      openPage,
      ifPage,
      settingsMenu,
      settingsToggle,
    };
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
  flex-direction: row;
}
.app-bar-icon-custom {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
}
.app-bar-icon-custom img {
  width: 30px;
  margin-right: 0.2em;
}
* {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}
/* .enable-select {
  user-select: auto;
} */
.my-login-outer {
  position: fixed;
  left: 0;
  top: 0;
  background-color: #00000066;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  z-index: 100;
}

.avatar {
  cursor: pointer;
}
</style>
