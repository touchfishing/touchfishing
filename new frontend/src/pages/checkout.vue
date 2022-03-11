<template>
  <v-main>
    <v-card
      :class="'my-checkout-cart-outer ' + (ifPC ? 'PC-view' : 'phone-view')"
      elevation="8"
      color="#E8EAF6"
    >
      <div class="my-checkout-cart">
        <div class="left-products">
          <v-btn
            class="auto-margin mb-0"
            color="transparent"
            size="large"
            prepend-icon="mdi-arrow-left-drop-circle"
            flat
            @click="historyBack"
            >{{ otherwords.back() }}</v-btn
          >
          <v-card
            class="auto-margin"
            elevation="2"
            v-for="(item, index) in proShow"
            :key="index"
          >
            <div class="auto-padding-x auto-padding-y-min cus-flex">
              <v-card-title class="px-0"
                ><v-icon>mdi-store</v-icon>{{ item.sname }}</v-card-title
              >
              <span class="price-all">{{ price(item.P) }}</span>
            </div>
            <v-card>
              <template v-for="(it, idx) in item.items" :key="idx">
                <v-divider></v-divider>
                <div class="cus-flex auto-padding">
                  <div class="cus-flex no-wrap-flex flex-2">
                    <div class="checkout-img"><img :src="it.cover" /></div>
                    <div class="mx-2 flex-2">{{ it.name }}</div>
                  </div>
                  <div>
                    <div v-for="sit in it.buy" :key="sit.sel" class="cus-flex">
                      <v-chip
                        class="my-1"
                        color="indigo"
                        prepend-icon="mdi-label"
                        append-
                      >
                        {{ it.specs[sit.sel] }}
                        <template v-slot:append
                          ><v-avatar color="#BBDEFB">{{
                            sit.num
                          }}</v-avatar></template
                        >
                      </v-chip>
                      <span class="ml-3">{{ sit.price }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </v-card>
          </v-card>
        </div>
        <v-card class="right-check" color="#5C6BC0" text-color="white">
          <div class="check-info">
            <div
              class="per-check-info"
              v-for="item in checkout"
              :key="item.key"
            >
              <div class="text-h6 auto-margin mb-2">{{ item.name() }}</div>
              <v-card
                class="auto-margin auto-padding-min my-2"
                color="#E8EAF612"
                text-color="white"
                elevation="2"
                v-if="item.type === 'card'"
                >{{ item.value }}</v-card
              >
              <v-card
                class="auto-margin auto-padding-min my-2"
                color="#E8EAF612"
                text-color="white"
                flat
                v-else-if="item.type === 'more'"
              >
                <template v-for="(it, indx) in item.more" :key="indx">
                  <div class="per-info-radio" v-if="it.type === 'radio'">
                    <v-btn-toggle v-model="it.default">
                      <v-btn
                        color="#E8EAF6"
                        v-for="li in it.values"
                        :value="li.key"
                        :key="li.key"
                        @click="li.click"
                        >{{ li.name() }}</v-btn
                      >
                    </v-btn-toggle>
                  </div>
                  <div class="per-info-kv" v-else-if="it.type === 'k-v'">
                    <span>{{ it.k() }}</span
                    ><span>{{ price(it.v) }}</span>
                  </div>
                </template>
              </v-card>
              <v-divider></v-divider>
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            @click="postCheckout"
            class="large-checkout auto-margin"
            width="-webkit-fill-available"
            color="#82B1FF"
            ><span class="price-all">{{ price(priceAll) }}</span
            ><v-card-subtitle class="large-size-all"
              >{{ otherwords.check()
              }}<v-icon>mdi-arrow-right-drop-circle</v-icon></v-card-subtitle
            ></v-btn
          >
        </v-card>
      </div>
    </v-card>
    <v-overlay
      :model-value="checkoutAni.show"
      class="align-center justify-center"
    >
      <template v-if="checkoutAni.status === 0">
        <v-progress-circular
          :size="200"
          :width="10"
          color="indigo darken-2"
          indeterminate
        ></v-progress-circular>
      </template>
      <template v-else-if="checkoutAni.status === 1">
        <EatFish />
      </template>
      <template v-else-if="checkoutAni.status === 2">
        <SuccessCheck />
      </template>
      <template v-else-if="checkoutAni.status === 3">
        <v-alert border="start" color="error" type="error">
          Sorry, but something went wrong. Please re-checkout!
        </v-alert>
      </template>
    </v-overlay>
  </v-main>
</template>

<script>
import ssSto from "../plugins/sessionStorage.js";
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import EatFish from "../components/eatFish.vue";
import SuccessCheck from "../components/successCheck.vue";
import axios from "axios";
export default {
  name: "checkoutPage",
  components: { EatFish, SuccessCheck },
  setup() {
    let info = ssSto.get("nowBuying");
    let fromcart = false;
    if (info === null) {
      info = ssSto.get("nowChecking");
      if (info === null) window.location.href = "/";
      else {
        // from shopping cart
        fromcart = true;
        let tmp = {};
        for (let i of info) {
          if (tmp[i.id]) {
            tmp[i.id].push({ num: i.num, sel: i.sel });
          } else {
            tmp[i.id] = [{ num: i.num, sel: i.sel }];
          }
        }
        info = tmp;
      }
    } else {
      // from product
      let tmp = {};
      tmp[info.pid] = [{ num: info.num, sel: info.selection }];
      info = tmp;
    }
    // console.log(info);
    // if (fromcart) console.log("cart ---- to be removed");

    const store = useStore();
    const proShow = reactive({});
    let priceAll = ref(0);

    let ifPC = ref(store.state.ifPC);
    watch(
      () => store.state.ifPC,
      (e) => {
        ifPC.value = e;
      }
    );

    var lang = ref(store.state.settings.language);
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.value = e;
      }
    );

    const otherwords = reactive({
      back: () => store.state.language[lang.value].pages.checkout.back,
      check: () => store.state.language[lang.value].pages.checkout.detail.check,
    });

    const checkout = reactive([
      {
        name: () => store.state.language[lang.value].pages.checkout.checkout,
        key: "address",
        type: "card",
        value: "Somewhere... Not so specific yet... in to-do list",
      },
      {
        name: () => store.state.language[lang.value].pages.checkout.shipping,
        key: "shipping",
        type: "more",
        more: [
          {
            type: "radio",
            default: "SHIP2",
            values: [
              {
                name: () =>
                  store.state.language[lang.value].pages.checkout.ship[0],
                key: "SHIP1",
                click: () => {},
              },
              {
                name: () =>
                  store.state.language[lang.value].pages.checkout.ship[1],
                key: "SHIP2",
                click: () => {},
              },
              {
                name: () =>
                  store.state.language[lang.value].pages.checkout.ship[2],
                key: "SHIP3",
                click: () => {},
              },
            ],
          },
        ],
      },
      {
        name: () => store.state.language[lang.value].pages.checkout.payment,
        key: "payment",
        type: "more",
        more: [
          {
            type: "radio",
            default: "creditcard",
            values: [
              {
                name: () =>
                  store.state.language[lang.value].pages.checkout.pay
                    .creditcard,
                key: "creditcard",
                click: () => {},
              },
              {
                name: () =>
                  store.state.language[lang.value].pages.checkout.pay.others,
                key: "others",
                click: () => {},
              },
            ],
          },
        ],
      },
    ]);

    const promises = [];
    const results = [];
    for (let i in info) {
      promises.push(
        axios.get(store.getters.UrlProductId(i)).then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            let tmp = res.data.data;
            tmp._buy_ = info[i];
            results.push(tmp);
          } else {
            alert(`something went wrong in pid=${i}, please re-checkout!`);
            window.history.back();
          }
        })
      );
    }

    const outArr = [];

    Promise.all(promises).then(() => {
      // console.log(results);
      for (let i of results) {
        if (!proShow[i.sid]) {
          proShow[i.sid] = {
            sname: i.sname,
            items: {},
          };
        }
        if (proShow[i.sid].items[i.pid]) {
          proShow[i.sid].items[i.pid].buy.push(...i._buy_);
        } else {
          proShow[i.sid].items[i.pid] = {
            buy: i._buy_,
            name: i.pname,
            specs: i.specs,
            prices: i.prices,
            stocks: i.stocks,
            shipping: i.shipping_region,
            cover: store.getters.Media(i.cover),
          };
        }
        let tmpp = 0;
        for (let j of proShow[i.sid].items[i.pid].buy) {
          j.num = Math.min(j.num, proShow[i.sid].items[i.pid].stocks[j.sel]);
          j.price = j.num * proShow[i.sid].items[i.pid].prices[j.sel];
          tmpp += j.price;
          outArr.push({
            sid: i.sid,
            pid: i.pid,
            spec: j.sel,
            quantity: j.num,
            address: "somewhere to be added",
          });
        }
        proShow[i.sid].P = tmpp;
        priceAll.value += tmpp;
      }
      // console.log(outArr);
      checkout.push({
        name: () => store.state.language[lang.value].pages.checkout.checkout,
        key: "checkout",
        type: "more",
        more: [
          {
            type: "k-v",
            key: "cost",
            k: () =>
              store.state.language[lang.value].pages.checkout.detail.cost,
            v: priceAll.value,
          },
          {
            type: "k-v",
            key: "discount",
            k: () =>
              store.state.language[lang.value].pages.checkout.detail.discount,
            v: 0,
          },
          {
            type: "k-v",
            key: "shipping",
            k: () =>
              store.state.language[lang.value].pages.checkout.detail.shipping,
            v: 0,
          },
          {
            type: "k-v",
            key: "tax",
            k: () => store.state.language[lang.value].pages.checkout.detail.tax,
            v: 0,
          },
          {
            type: "k-v",
            key: "total",
            k: () =>
              store.state.language[lang.value].pages.checkout.detail.total,
            v: priceAll.value,
          },
        ],
      });
    });

    function price(x) {
      return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function historyBack() {
      window.history.back();
    }
    function formD(a) {
      let fd = new FormData();
      const k = ["pid", "address", "quantity", "spec"];
      for (let i of k) {
        fd.append(i, a[i]);
      }
      return fd;
    }

    const checkoutAni = reactive({
      show: false,
      status: 0, // loading, sending, done, error
    });

    function postCheckout() {
      checkoutAni.show = true;
      if (outArr.length === 0 || priceAll.value < 0) {
        checkoutAni.status = 3;
        setTimeout(() => {
          checkoutAni.show = false;
          window.location.href = "/";
        }, 1500);
        return;
      }
      checkoutAni.status = 1;
      const pros = [];
      for (let i of outArr) {
        pros.push(
          axios
            .post(store.getters.UrlCheckout(i.pid), formD(i), {
              withCredentials: true,
              headers: {
                cookie: store.getters.LoginSession,
              },
            })
            .then((res) => {
              if (res.status === 200) {
                // post success
                if (res.data.code === 200) {
                  // purchase successfully
                  // res.data.data: {oid:,status:}
                  i.done = true;
                } else {
                  alert("error in action, message: ", res.data.msg);
                }
              } else {
                console.error("error in post", res.statusText);
              }
            })
            .catch((e) => console.error(e))
        );
      }
      Promise.all(pros).then(() => {
        if (fromcart)
          for (let i of outArr) {
            if (i.done) {
              store.getters.CartRemove(i.sid, i.pid, i.spec);
            }
          }
        checkoutAni.status = 2;
        setTimeout(() => {
          checkoutAni.show = false;
          window.location.href = "/order";
        }, 1500);
        ssSto.remove("nowBuying");
        ssSto.remove("nowChecking");
      });
    }

    return {
      proShow,
      checkout,
      price,
      priceAll,
      historyBack,
      postCheckout,
      checkoutAni,
      ifPC,
      otherwords,
    };
  },
};
</script>

<style scoped>
.my-checkout-cart-outer {
  position: fixed;
  left: 5vw;
  top: 10vh;
  width: 90vw;
  height: 80vh; /* change to 100 later */
  margin-bottom: 10vh;
}
.my-checkout-cart-outer.phone-view {
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  margin-bottom: 0;
}
.my-checkout-cart {
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 100%;
  overflow-y: auto;
}
.left-products {
  max-width: min(100%, 600px);
  min-width: max(300px, 50%);
  width: min(50%, 400px);
  height: 100%;
  flex: 1;
  overflow-y: auto;
}
.phone-view .left-products {
  height: auto;
}
.right-check {
  max-width: min(100%, 600px);
  min-width: max(300px, 50%);
  width: calc(100% - min(50%, 400px));
  height: 100%;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.phone-view .right-check {
  height: auto;
  border-radius: 1em 1em 0.3em 0.3em;
  padding: 0.5em;
}

.per-info-kv {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: -webkit-fill-available;
}

.price-all {
  font-weight: bolder;
  font-size: 1.3em;
  color: #d32f2f;
}
.price-all::before {
  content: "￥";
}

/* .checkout-per-pro-info {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
} */
.checkout-img {
  width: 64px;
  height: 64px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
.checkout-img > img {
  max-width: 100%;
  max-height: 100%;
}

.large-checkout {
  display: flex;
  justify-content: space-between;
  font-size: 1.3em;
  height: 2.5em;
  border-radius: 0.6em;
}
.large-checkout > .price-all {
  color: #fde2e2;
  text-shadow: 0 0 2px #727272;
}
.large-size-all {
  font-size: 1em;
}
</style>