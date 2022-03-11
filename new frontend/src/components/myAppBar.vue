<template>
  <v-bottom-navigation>
    <v-btn
      class="flex-2"
      flat
      v-for="it in barBtns"
      :key="it.key"
      @click="it.click"
    >
      <div class="appbar-up-down">
        <template v-if="it.key === 'home'">
          <template v-if="cur === it.location"
            ><img class="app-bar-size0" src="/fishicon.svg"
          /></template>
          <template v-else
            ><img class="app-bar-size1" src="/fishicon.svg" /><span>{{
              it.name()
            }}</span></template
          >
        </template>
        <template v-else>
          <v-chip
            class="flex-2 py-1"
            :color="cur === it.location ? 'primary' : ''"
            ><v-icon>{{ it.icon }}</v-icon></v-chip
          >
          <span>{{ it.name() }}</span>
        </template>
      </div>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { reactive, computed, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "AppBar",
  setup() {
    const store = useStore();
    let settings = reactive({
      ifPC: store.state.ifPC,
    });

    var lang = reactive({
      v: store.state.language[store.state.settings.language].appBar,
    });
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.v = store.state.language[e].appBar;
      }
    );

    function cusJump(a) {
      if (cur.value !== a) {
        window.location.href = a;
      }
    }
    const barBtns = reactive([
      {
        name: () => lang.v.btns.home,
        key: "home",
        location: "/",
        color: "",
        icon: "mdi-home",
        click: () => {
          cusJump("/");
        },
      },
      {
        name: () => lang.v.btns.cart,
        key: "cart",
        location: "/cart",
        color: "",
        icon: "mdi-cart",
        click: () => {
          cusJump("/cart");
        },
      },
      {
        name: () => lang.v.btns.me,
        key: "me",
        location: "/user",
        color: "",
        icon: "mdi-account-circle",
        click: () => {
          cusJump("/user");
        },
      },
    ]);

    let cur = computed({
      get: () => {
        return window.location.pathname;
      },
    });

    return { barBtns, cur, settings };
  },
};
</script>

<style scoped>
.appbar-up-down {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.app-bar-size0 {
  width: 3.6em;
  height: 3.6em;
}
.app-bar-size1 {
  width: 2.3em;
  height: 2.3em;
}
</style>