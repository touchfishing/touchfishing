<template>
  <ul :class="'my-slides-outer ' + (ifPC ? 'PC-view' : 'phone-view')">
    <div class="per-pic-round">
      <li
        v-for="(item, idx) in slides"
        :key="'small-round' + idx"
        :class="idx === cur ? 'round-no' : 'round-yes'"
        @click="changeCur(idx)"
      ></li>
    </div>
    <div class="per-pic-lr-btn">
      <v-btn
        @click="moveCur(0)"
        icon="mdi-chevron-left"
        class="grey lighten-3 transicon"
      ></v-btn>
      <v-btn
        @click="moveCur(1)"
        icon="mdi-chevron-right"
        class="grey lighten-3 transicon"
      ></v-btn>
    </div>
    <div ref="touch" class="per-slide-outer">
      <li
        class="per-slide-outer"
        v-show="idx === cur"
        v-for="(item, idx) in slides"
        :key="'slides_' + idx"
        :style="{ backgroundColor: colorSet[idx] }"
      >
        <div class="per-slide-pic">{{ item() }}</div>
        <ul class="per-slide-dec">
          <li
            class="per-slide-pops"
            v-for="(it, idx2) in configs[idx]"
            :key="'s_' + idx + '_sub_' + idx2"
            :style="{
              backgroundColor: it.color,
              width: it.sz + 'vw',
              height: it.sz + 'vw',
              top: it.dy + '%',
              left: it.dx + '%',
            }"
          ></li>
        </ul>
      </li>
    </div>
  </ul>
</template>

<script>
import assignTouchE from "../plugins/swip.js";
import { useStore } from "vuex";
import { ref, reactive, onMounted, watch } from "vue";
export default {
  name: "NavSlides",
  setup() {
    let touch = ref(null);
    const store = useStore();
    let ifPC = ref(store.state.ifPC);
    watch(
      () => store.state.ifPC,
      (e) => {
        ifPC.value = e;
      }
    );

    let lang = ref(store.state.settings.language);
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.value = e;
      }
    );

    let cur = ref(0);
    const slides = reactive([]);
    for (let i = 1; i <= 5; i++) {
      slides.push(() =>
        lang.value === 0 ? `预留占位符${i}` : `Preset placeholder${i}`
      );
    }
    const colorSet = reactive([
      "#aeb4fd",
      "#d0cefd",
      "#b4cafe",
      "#9adefe",
      "#c7b3ff",
      "#fdeae7",
      "#a5c0b9",
      "#4184be",
    ]);
    const colorSet2 = [
      "#353091",
      "#5f59f7",
      "#6592fd",
      "#44c2fd",
      "#8c61ff",
      "#f9b4ab",
      "#679186",
      "#264e70",
    ];
    const configs = reactive([]);
    for (let i = 0; i < slides.length; i++) {
      let cnt = Math.round(Math.random() * 8) + 5;
      let arr = [];
      for (let j = 0; j < cnt; j++) {
        let dx = Math.round(Math.random() * 800) / 10 + 10;
        let dy = Math.round(Math.random() * 800) / 10 + 10;
        let sz = Math.round(Math.random() * 20) + 10;
        if (j === 0) [dx, dy, sz] = [50, 50, 30]; // % % vw
        arr.push({ dx, dy, sz, color: colorSet2[i] });
      }
      configs.push(arr);
    }

    function moveSlide(wh) {
      let mv = 1;
      if (wh === 0) mv = -1;
      cur.value = (cur.value + mv + slides.length) % slides.length;
    }

    function itvl() {
      return setInterval(() => {
        moveSlide();
      }, 10000);
    }

    let itvls = undefined;

    onMounted(() => {
      itvls = itvl();
      assignTouchE(touch.value, [
        function () {
          moveSlide();
        },
        function () {
          moveSlide(0);
        },
      ]);
    });

    function changeCur(idx) {
      clearInterval(itvls);
      cur.value = idx;
      itvls = itvl();
    }

    function moveCur(wh) {
      clearInterval(itvls);
      moveSlide(wh);
      itvls = itvl();
    }

    return {
      cur,
      slides,
      configs,
      colorSet,
      changeCur,
      moveCur,
      ifPC,
      touch,
    };
  },
};
</script>

<style>
@keyframes appearAni {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
.my-slides-outer {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.per-pic-round {
  position: absolute;
  bottom: 5%;
  right: 35%;
  z-index: 4;
}
.phone-view .per-pic-round {
  bottom: 3vh;
  left: 50vw;
  right: unset;
  transform: translateX(-50%);
  width: fit-content;
}
.per-pic-round li {
  list-style: none;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: inline-block;
  margin-left: 20px;
  transition: 1s;
  cursor: pointer;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
.per-pic-round .round-yes {
  background-color: #ffffff85;
}
.per-pic-round .round-no {
  background-color: #00000057;
}
.per-pic-lr-btn {
  z-index: 6;
  position: absolute;
  top: 50%;
  right: 0;
}
.phone-view .per-pic-lr-btn {
  top: calc(75vh - 4.5em);
  width: 100%;
}
.per-slide-outer {
  list-style: none;
  width: 100%;
  height: 100%;
  position: relative;
  animation: appearAni 1s;
}
.per-slide-pic {
  position: absolute;
  bottom: 20%;
  right: 20%;
  z-index: 2;
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
.phone-view .per-slide-pic {
  top: 50vh;
  left: 1vw;
  width: 98vw;
}
.per-slide-dec {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: relative;
}
.per-slide-pops {
  border-radius: 50%;
  list-style: none;
  position: absolute;
  opacity: 0.8;
  z-index: 1;
}

.transicon {
  position: absolute;
  opacity: 0.5;
  top: 0;
  transform: translate(0, -50%);
}
.transicon:first-child {
  right: 52vw;
}
.transicon:nth-child(2) {
  right: 2vw;
}
.phone-view .transicon:first-child {
  left: 2vw;
}
</style>