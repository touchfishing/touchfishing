<template>
  <v-main>
    <v-card
      :class="'my-cart-outer ' + (ifPC ? '' : 'phone-view')"
      elevation="8"
    >
      <v-card-header>
        <img class="cart-header-icon" :src="cartPage.img" />
        <div class="cart-header">
          <v-card-title>{{ cartPage.title() }}</v-card-title>
          <v-card-subtitle>{{ cartPage.welcome() }}</v-card-subtitle>
        </div>
      </v-card-header>
      <div class="cart-list">
        <!-- group by stores -->
        <v-card
          v-for="(item, idx) in cartPage.items"
          :key="idx"
          :class="ifPC ? 'ma-4' : 'mb-2'"
          elevation="4"
          color="#FAFAFA"
        >
          <v-card-subtitle>
            <div class="checkbox-in-cart">
              <v-checkbox disabled hide-details></v-checkbox>
            </div>
            <v-icon>mdi-store</v-icon>{{ item.name }}
          </v-card-subtitle>
          <!-- every item in this store -->
          <v-card
            v-for="(it, idx2) in item.items"
            :key="idx2"
            class="cart-per-item pl-2 pr-2 ma-2"
            elevation="8"
          >
            <div class="checkbox-in-cart">
              <v-checkbox
                v-model="it.check"
                @change="checkIt(item.id, it)"
                hide-details
              ></v-checkbox>
            </div>
            <div class="cart-header-img">
              <img class="pointer" :src="it.cover" @click="openPage(it.pid)" />
            </div>
            <div class="cart-header cart-title-size">
              <v-card-title class="pa-1 pointer" @click="openPage(it.pid)">{{
                it.title
              }}</v-card-title>
              <v-card-subtitle class="px-1">{{
                it.spec[it.selection]
              }}</v-card-subtitle>
            </div>
            <v-spacer></v-spacer>
            <!-- add, num, minus -->
            <NumCtrl
              :changeNum="numChange.change(it, it.stock[it.selection], item.id)"
              :bottomText="numChange.text(it.stock[it.selection])"
              :ipt_num2="it"
              :nopadding="true"
              :onlybtn="true"
            />
            <v-spacer></v-spacer>
            <!-- current price -->
            <v-card-text class="my-price-tag">{{
              price(it.num, it.price[it.selection])
            }}</v-card-text>
            <v-spacer></v-spacer>
            <v-btn
              v-show="ifPC"
              flat
              text-color="grey"
              icon="mdi-delete"
              @click="removeEntry(item.id, it.pid, +it.selection)"
            >
            </v-btn>
          </v-card>
        </v-card>
      </div>
    </v-card>
    <v-footer
      v-show="selectedInfo.num > 0"
      :class="'to-check-out-footer ' + (ifPC ? 'mb-0' : 'mb-12 px-1')"
      elevation="10"
    >
      <div v-show="ifPC">{{ cartPage.selected() }}</div>
      <div v-show="ifPC" class="haschoose ml-1 mr-3">
        {{ selectedInfo.num }}
      </div>
      <div v-show="ifPC">{{ cartPage.total() }}</div>
      <div class="choosesum ml-1">{{ price(1, selectedInfo.price) }}</div>
      <v-spacer></v-spacer>
      <v-btn
        class="ml-1"
        v-for="it in footerAction"
        flat
        :key="it.key"
        @click="it.click"
        :color="it.color"
        >{{ it.name() }}</v-btn
      >
    </v-footer>
  </v-main>
</template>

<script>
import NumCtrl from "../components/numCtrl.vue";
import { reactive, nextTick, ref, watch } from "vue";
import { useStore } from "vuex";
import ssSto from "../plugins/sessionStorage.js";

export default {
  name: "cartPage",
  components: { NumCtrl },
  setup() {
    const store = useStore();
    // console.log(store.getters.Cart);
    var lang = ref(store.state.settings.language);
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.value = e;
      }
    );
    let cartnum = ref(store.getters.Cart.num);

    const cartPage = reactive({
      img: "/fishicon.svg",
      title: () => store.state.language[lang.value].pages.cart.title,
      welcome: () =>
        store.state.language[lang.value].pages.cart.welcome(cartnum.value),
      items: store.getters.Cart.stores,
      selected: () => store.state.language[lang.value].pages.cart.selected,
      total: () => store.state.language[lang.value].pages.cart.total,
    });

    function openPage(k) {
      store.commit("URLTO", "/product?pid=" + k);
    }

    function removeEntry(sid, pid, sel) {
      if (store.getters.CartRemove(sid, pid, sel)) {
        checkIt(false, { check: false, pid, selection: sel });
        nextTick(() => {
          cartPage.items = store.getters.Cart.stores;
          cartnum.value = store.getters.Cart.num;
        });
      }
    }

    function price(a, b) {
      return "￥ " + String(+a * +b).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const numChange = reactive({
      change: (a, b, c) => (t, x) => {
        let tmp = a.num;
        if (t === 0) {
          a.num--;
          a.num = Math.max(1, a.num);
        } else if (t === 1) {
          a.num++;
          a.num = Math.min(b, a.num);
        } else if (t === 2) {
          a.num = +x.value;
          if (a.num <= 0) a.num = 1;
          a.num = Math.min(b, a.num);
        }
        if (a.num !== tmp) {
          // number has changed
          store.getters.CartNum(c, a.pid, a.selection, a.num, a.check);
          checkIt(false, a);
        }
      },
      text: store.state.language[lang.value].pages.cart.stock,
    });

    const selectedBuy = reactive(new Map());
    const selectedInfo = reactive({ num: 0, price: 0 });
    !(function () {
      for (let i of store.getters.Cart.stores) {
        for (let j of i.items) {
          if (j.check)
            selectedBuy.set(String(j.pid) + "_" + String(j.selection), {
              ...j,
              sid: i.id,
            });
        }
      }
      calculateSelect();
    })();

    function checkIt(sid, a) {
      let k = String(a.pid) + "_" + String(a.selection);
      if (a.check) {
        selectedBuy.set(k, { ...a, sid });
      } else {
        selectedBuy.delete(k);
      }
      if (sid !== false) {
        store.getters.CartNum(sid, a.pid, a.selection, a.num, a.check);
      }
      calculateSelect();
    }
    function calculateSelect() {
      let [cnt, money] = [0, 0];
      // console.log(selectedBuy);
      for (const v of selectedBuy.values()) {
        cnt++;
        money += v.num * v.price[v.selection];
      }
      selectedInfo.num = cnt;
      selectedInfo.price = money;
    }
    // let cartSelected = reactive(["230_3", "232_0"]);

    const footerAction = reactive([
      {
        name: () => store.state.language[lang.value].pages.cart.remove,
        key: "remove",
        icon: "",
        color: "#FFCC80",
        click: () => {
          for (const v of selectedBuy.values())
            removeEntry(v.sid, v.pid, v.selection);
        },
      },
      {
        name: () => store.state.language[lang.value].pages.cart.wishlist,
        key: "wishlist",
        icon: "",
        color: "#90CAF9",
        click: () => {},
      },
      {
        name: () => store.state.language[lang.value].pages.cart.checkout,
        key: "checkout",
        icon: "",
        color: "#FFAB91",
        click: () => {
          let tmp = [];
          for (const v of selectedBuy.values()) {
            tmp.push({ id: v.pid, num: v.num, sel: v.selection });
          }
          if (tmp.length === 0) return;
          ssSto.set("nowChecking", tmp);
          window.location.href = "/checkout";
        },
      },
    ]);

    let ifPC = ref(store.state.ifPC);
    watch(
      () => store.state.ifPC,
      (e) => {
        ifPC.value = e;
      }
    );

    return {
      cartPage,
      openPage,
      price,
      removeEntry,
      numChange,
      checkIt,
      selectedInfo,
      footerAction,
      ifPC,
    };
  },
};
</script>

<style scoped>
.my-cart-outer {
  width: 90vw;
  min-height: 80vh;
  left: 5vw;
  top: 5vh;
  margin-bottom: 15vh;
}
.my-cart-outer.phone-view {
  height: calc(100vh - 3.5em);
  left: 0;
  top: 0;
  width: 100vw;
  margin-bottom: 0;
  padding-bottom: 5em;
  overflow-y: auto;
  overflow-x: hidden;
}
.cart-header-icon {
  width: 50px;
}
.cart-header {
  display: flex;
  flex-direction: column;
  margin-left: 0.8em;
}
.cart-header-img {
  height: 64px;
  width: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cart-header-img > img {
  max-width: 100%;
  max-height: 100%;
}

.cart-per-item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
}
.my-price-tag {
  padding: 0.2em;
  font-size: min(3vw, 1.5em);
  font-weight: bolder;
  text-align: right;
  flex: 1.5;
}
.cart-title-size {
  width: min(35vw, 200px);
  flex: auto;
}
.cart-title-size > div {
  max-width: 100%;
  max-height: 3em;
  overflow: hidden;
  word-break: break-all;
}
.cart-title-size > div:first-child {
  font-size: min(3vw, 1.3em);
  line-height: min(3vw, 1.3em);
}

.to-check-out-footer {
  position: fixed;
  bottom: 0;
  width: 100vw;
  animation: showup 0.5s;
}
.to-check-out-footer .choosesum {
  color: #ec3939;
  font-weight: bold;
  font-size: 1.3em;
}

@keyframes showup {
  0% {
    transform: translate(0, 100%);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>