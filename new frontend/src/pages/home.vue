<template>
  <v-btn
    v-if="!ifPC"
    class="goback-top-btn-right"
    color="#E0F7FA"
    icon="mdi-google-translate"
    @click="settingsToggle"
  ></v-btn>
  <v-navigation-drawer v-if="!ifPC" class="pa-4" v-model="settingsMenu">
    <DefSettings />
  </v-navigation-drawer>
  <v-main style="height: 100vh" :class="ifPC ? 'PC-view' : 'phone-view'">
    <div class="searchbox">
      <BigSearch />
    </div>
    <div class="my-pops-left">
      <NavPops />
      <div class="fish-container"><Fish /></div>
    </div>
    <div class="my-slides"><NavSlides /></div>
  </v-main>
</template>

<script>
import ifPcFunc from "../plugins/detectPC.js";
import { reactive, ref } from "vue";
// import useStore from "vuex";
import NavPops from "../components/NavPops.vue";
import NavSlides from "../components/NavSlides.vue";
import BigSearch from "../components/BigSearch.vue";
import Fish from "../components/Fish.vue";
import DefSettings from "../components/settings.vue";

export default {
  name: "homePage",
  components: {
    NavPops,
    NavSlides,
    BigSearch,
    Fish,
    DefSettings,
  },
  setup() {
    let b = reactive({ a: 1 });

    let ifPC = ref(ifPcFunc());
    window.addEventListener("resize", () => {
      ifPC.value = ifPcFunc();
    });

    /* the settings menu */
    let settingsMenu = ref(false);
    function settingsToggle() {
      settingsMenu.value = !settingsMenu.value;
    }

    return {
      settingsMenu,
      settingsToggle,
      b,
      ifPC,
    };
  },
};
</script>

<style scoped>
.my-pops-left {
  position: absolute;
  background-color: #11111111;
  z-index: 5;
  overflow: hidden;
}
.PC-view .my-pops-left {
  width: 40%;
  height: 100%;
  top: 0;
  left: 0;
}
.phone-view .my-pops-left {
  height: 50vh;
  width: 100vw;
  left: 0;
  top: 0;
}

.my-slides {
  width: 100%;
  height: 100%;
}

.searchbox {
  position: absolute;
  z-index: 10;
}
.PC-view .searchbox {
  left: 50%;
  top: 10%;
  width: 40vw;
  max-width: 800px;
}
.phone-view .searchbox {
  top: 50%;
  left: 2vw;
  width: 96vw;
}

.fish-container {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: -1;
  animation: swim 16s linear infinite;
  /* animation-play-state: paused; */
}

@keyframes swim {
  0% {
    transform: rotate(360deg) scaleX(1);
    left: 0;
    bottom: 0;
  }
  10% {
    transform: rotate(358deg) scaleX(1);
    left: 20%;
    bottom: 0;
  }
  25% {
    transform: rotate(354deg) scaleX(1);
    left: 36%;
    bottom: 10%;
  }
  30% {
    transform: rotate(362deg) scaleX(1);
    left: 45%;
    bottom: 6%;
  }
  40% {
    transform: rotate(368deg) scaleX(1);
    left: 55%;
    bottom: 3%;
  }
  50% {
    transform: rotate(360deg) scaleX(-1);
    left: 68%;
    bottom: 2%;
  }
  60% {
    transform: rotate(358deg) scaleX(-1);
    left: 40%;
    bottom: 3%;
  }
  70% {
    transform: rotate(355deg) scaleX(-1);
    left: 20%;
    bottom: 2%;
  }
  80% {
    transform: rotate(352deg) scaleX(-1);
    left: 5%;
    bottom: 1%;
  }
  90% {
    transform: rotate(357deg) scaleX(1);
    left: -5%;
    bottom: -1%;
  }
  100% {
    transform: rotate(360deg) scaleX(1);
    left: 0;
    bottom: 0;
  }
}
</style>
