<template>
  <div :class="'search-outer' + (inNav ? ' nav' : '')">
    <v-icon color="grey" class="my-search-cam-icon">mdi-camera</v-icon>
    <div class="text-center my-dropdown-menu">
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn flat color="transparent" v-bind="props" rounded="0">{{
            lang.v.selectMenu[selectedOpt]
          }}</v-btn>
        </template>
        <v-list class="mydefinedlist" color="white">
          <li
            class="drop-down-btn"
            v-for="(item, index) in lang.v.selectMenu"
            :key="index"
          >
            <v-btn flat color="transparent" @click="selectedOpt = index">{{
              item
            }}</v-btn>
          </li>
        </v-list>
      </v-menu>
    </div>
    <v-divider inset vertical></v-divider>
    <input
      v-model="searchKey"
      class="my-search-input"
      :placeholder="lang.v.placeholder"
      @keyup.enter="searchIt"
    />
    <v-icon color="grey" class="my-search-icon" @click="searchIt"
      >mdi-magnify</v-icon
    >
  </div>
</template>

<script>
import { ref, reactive, watch, onBeforeMount, inject } from "vue";
import { useStore } from "vuex";

export default {
  name: "BigSearch",
  props: ["inNav"],
  setup() {
    const store = useStore();
    var lang = reactive({
      v: store.state.language[store.state.settings.language].bigsearch,
    });
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.v = store.state.language[e].bigsearch;
      }
    );
    let searchKey = ref("");
    let selectedOpt = ref(0);

    onBeforeMount(() => {
      searchKey.value = inject("sval");
    });

    function searchIt() {
      if (
        searchKey.value !== "" &&
        searchKey.value !== null &&
        searchKey.value !== undefined
      ) {
        let ifStore = selectedOpt.value === 0 ? "/search" : "/ssearch";
        let query = new URLSearchParams("kw");
        query.set("kw", searchKey.value);
        let toUrl = `${ifStore}?${query}`;
        store.commit("URLTO", toUrl);
        // if (store.state.ifPC && window.location.pathname !== ifStore) {
        //   window.open(toUrl);
        // } else {
        //   window.location.href = toUrl;
        // }
      }
    }
    return {
      searchKey,
      selectedOpt,
      searchIt,
      lang,
    };
  },
};
</script>

<style scoped>
.search-outer {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  width: 100%;
  background-color: white;
  border-radius: 60px;
  padding: 0 10px;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
.search-outer.nav {
  height: 100%;
  box-shadow: none;
}
.drop-down-btn {
  list-style: none;
}
.mydefinedlist {
  overflow: hidden;
  padding: 0;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
.my-search-icon,
.my-search-cam-icon {
  cursor: pointer;
}
.my-search-input {
  border: none;
  outline: none;
  margin-left: 4px;
  width: calc(100% - 120px);
}
.my-search-input:focus {
  outline: none;
}
</style>