<template>
  <li
    class="pops-list"
    v-for="(item, idx) in list"
    @click="clickTag(item.cname)"
    :key="'pops_' + idx"
    :style="{
      width: item.style.rw + 'px',
      height: item.style.rw + 'px',
      top: item.style.ry + '%',
      left: item.style.rx + '%',
    }"
  >
    <v-icon :icon="'mdi-' + item.icon"></v-icon>
    <div>
      <template v-if="lang === 0">{{ item.cname }}</template
      ><template v-else>{{ item.ename }}</template>
    </div>
  </li>
</template>

<script>
import { reactive, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
export default {
  name: "NavPops",
  setup() {
    const store = useStore();
    let lang = ref(store.state.settings.language);
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.value = e;
      }
    );
    const l = [
      {
        cname: "电脑",
        ename: "computer",
        icon: "laptop",
      },
      {
        cname: "食品",
        ename: "food",
        icon: "hamburger",
      },
      {
        cname: "零食",
        ename: "snack",
        icon: "peanut",
      },
      {
        cname: "手机",
        ename: "phone",
        icon: "cellphone",
      },
      {
        cname: "饮品",
        ename: "drink",
        icon: "bottle-soda-classic",
      },
      {
        cname: "服装",
        ename: "clothing",
        icon: "tshirt-crew",
      },
      {
        cname: "鞋类",
        ename: "shoes",
        icon: "shoe-sneaker",
      },
      {
        cname: "办公",
        ename: "office",
        icon: "printer",
      },
      {
        cname: "水果",
        ename: "fruit",
        icon: "fruit-cherries",
      },
      {
        cname: "家具",
        ename: "furniture",
        icon: "table-furniture",
      },
      {
        cname: "汽车",
        ename: "car",
        icon: "car",
      },
      {
        cname: "娱乐",
        ename: "entertainment",
        icon: "dice-4",
      },
      {
        cname: "家电",
        ename: "electric",
        icon: "hair-dryer",
      },
    ];
    for (let i of l) {
      let rw = Math.round(Math.random() * 20) + 55;
      let rx = Math.round(Math.random() * 90);
      let ry = Math.round(Math.random() * 90);
      i["style"] = {
        rw,
        rx,
        ry,
      };
    }

    const list = reactive(l);

    const stylelist = ["rw", "rx", "ry"];

    function randomMove() {
      for (let i of list) {
        for (let j of stylelist) {
          let offset = Math.round(Math.random() * 10) - 5;
          let res = i.style[j] + offset;
          if (res <= 0) res = 0;
          if (res >= 90) res = 90;
          if (j === "rw" && res <= 40) res = 40 + Math.round(Math.random() * 5);
          else if (j === "rw" && res >= 70)
            res = 70 + Math.round(Math.random() * 5);
          i.style[j] = res;
        }
      }
    }

    onMounted(() => {
      setTimeout(randomMove, 100);
      setInterval(randomMove, 5500);
    });

    function clickTag(t) {
      store.commit("URLTO", "/search?tag=" + t);
    }

    return {
      list,
      clickTag,
      lang,
    };
  },
};
</script>

<style scoped>
.pops-list {
  position: absolute;
  border-radius: 50%;
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: #e5e5e57a;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  opacity: 0.8;
  transition: top 8s, left 8s, width 5s, height 5s, opacity 0.4s;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
.pops-list:hover {
  opacity: 1;
}
</style>
