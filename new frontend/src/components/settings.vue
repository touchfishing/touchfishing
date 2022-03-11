<template>
  <div class="mb-3" v-for="item in menuDetail" :key="item.key">
    <v-banner-text>{{ item.title() }}</v-banner-text>
    <template v-if="item.type === 'radio'">
      <v-item-group mandatory v-model="item.default">
        <div class="cus-flex mt-2">
          <v-item
            v-for="(it, i) in item.values()"
            :key="i"
            v-slot="{ isSelected, toggle }"
            :value="i + 1"
          >
            <div>
              <v-chip
                label
                class="mr-2 mb-2 transition06"
                :color="isSelected ? 'cyan' : ''"
                @click="toggle"
                >{{ it }}</v-chip
              >
            </div>
          </v-item>
        </div>
      </v-item-group>
    </template>
  </div>
</template>

<script>
import { reactive, watch, watchEffect } from "vue";
import { useStore } from "vuex";
export default {
  name: "DefSettings",
  setup() {
    const store = useStore();
    var lang = reactive(
      store.state.language[store.state.settings.language].settings
    );
    watch(
      () => store.state.settings.language,
      (e) => {
        lang = store.state.language[e].settings;
      }
    );

    const menuDetail = reactive([
      {
        title: () => lang.menu.language.title,
        key: "language",
        type: "radio",
        default: store.state.settings.language + 1,
        values: () => ["简体中文", "English"],
      },
      {
        title: () => lang.menu.theme.title,
        key: "theme",
        type: "radio",
        default: 1,
        values: () => lang.menu.theme.values,
      },
    ]);
    watchEffect(() => {
      store.commit("SETTINGS", ["language", +menuDetail[0].default - 1]);
    });

    return { menuDetail };
  },
};
</script>

<style>
</style>