<template>
  <v-main>
    <div class="no-product" v-if="status !== 1">
      <v-progress-circular
        v-if="status === 0"
        :size="200"
        color="orange"
        indeterminate
      ></v-progress-circular>
      <div v-else-if="status === 2"></div>
      <div v-else-if="status === 3"></div>
      <div v-else-if="status === 4"></div>
      <span class="no-product-word">{{ lWords[status]() }}</span>
    </div>
    <v-card
      :class="'my-product-card ' + (ifPC ? 'PC-view' : 'phone-view')"
      v-if="status === 1"
      elevation="8"
    >
      <div class="cover-div">
        <img :src="product.cover" />
        <v-img :src="product.cover"></v-img>
      </div>
      <div class="product-line">
        <div class="pro-per-line auto-margin product-title-tag">
          <v-card-title class="product-title pro-per-line">{{
            product.title
          }}</v-card-title>
          <div class="pro-tags">
            <v-chip
              v-for="(i, idx) in product.tags"
              :key="idx"
              color="pink"
              text-color="white"
              prepend-icon="mdi-label-multiple"
              @click="searchByTag(i)"
            >
              {{ i }}
            </v-chip>
          </div>
        </div>
        <div class="pro-per-line auto-margin-x">
          <v-card-text class="product-store"
            ><v-icon>mdi-store</v-icon>{{ product.store.sname }}</v-card-text
          >
          <div class="product-from">{{ product.region() }}</div>
          <div class="product-ship">{{ product.ship() }}</div>
        </div>
        <!-- ratting & price -->
        <div class="pro-per-line auto-margin">
          <v-card-text class="product-prices"
            ><span class="money-tag">￥</span
            >{{ product.prices[pselected] }}</v-card-text
          >
          <v-rating
            class="product-rating"
            v-model="product.rating"
            density="compact"
            readonly
            size="default"
            color="yellow-accent-4"
            half-increments
          ></v-rating>
        </div>
        <!-- detail tab group -->
        <div class="auto-margin-x">
          <div class="tabs-btn-group">
            <v-btn
              v-for="(item, idx) in tabs"
              :key="item.key"
              @click="changeTab(+idx)"
              flat
              class="pl-8 pr-8 my-tabs-btn"
              :color="+tabselected === +idx ? '#e0e5ff' : 'transparent'"
              :text-color="+tabselected === +idx ? 'indigo' : '#888'"
            >
              <v-icon left :icon="item.icon"></v-icon>
              {{ item.name() }}
            </v-btn>
          </div>
          <v-card-text>{{ tabs[tabselected].info() }}</v-card-text>
        </div>
        <!-- specs -->
        <div class="pro-per-line product-specs auto-margin">
          <v-btn
            :color="idx === pselected ? 'blue' : '#E3F2FD'"
            :text-color="idx === pselected ? '#fafafa' : '#5C6BC0'"
            v-for="(item, idx) in product.specs"
            :key="idx"
            @click="selectSpec(idx)"
          >
            {{ item }}
          </v-btn>
        </div>
        <v-spacer v-show="ifPC" class="mt-auto"></v-spacer>
        <!-- num, add to card -->
        <NumCtrl
          class="auto-margin-x"
          :changeNum="ipt.changeNum"
          :ipt_num="ipt.num"
          :bottomText="ipt.bottomText()"
        />
        <div class="pro-per-line auto-margin">
          <v-btn
            class="bottom-three-buttons"
            v-for="i in bottomBtns"
            :key="i.key"
            rounded="pill"
            :text-color="i.textColor"
            :color="i.color"
            :prepend-icon="i.icon"
            @click="i.click"
            >{{ i.name() }}</v-btn
          >
        </div>
      </div>
    </v-card>
  </v-main>
</template>

<script>
import NumCtrl from "../components/numCtrl.vue";
import axios from "axios";
import { reactive, ref, computed, onBeforeMount, watch } from "vue";
import { useStore } from "vuex";

import ssSto from "../plugins/sessionStorage.js";

export default {
  name: "productPage",
  components: { NumCtrl },
  setup() {
    let status = ref(0);
    let pselected = ref(0);
    let tabselected = ref(0);
    const store = useStore();
    let product = reactive({});
    let tabs = reactive({});

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

    function getProduct() {
      const pid = new URL(window.location.href).searchParams.get("pid");
      if (pid !== "" && pid !== null && pid !== undefined) {
        axios
          .get(store.getters.UrlProductId(pid))
          .then((res) => {
            if (res.status === 200) {
              if (res.data.code === 200) {
                try {
                  let tmp = res.data.data;
                  Object.assign(tabs, [
                    {
                      key: "description",
                      name: () =>
                        store.state.language[lang.value].pages.product.tabs
                          .description.title,
                      info: () => tmp.info,
                      icon: "mdi-text-short",
                    },
                    {
                      key: "coupon",
                      name: () =>
                        store.state.language[lang.value].pages.product.tabs
                          .coupon.title,
                      info: () =>
                        store.state.language[lang.value].pages.product.tabs
                          .coupon.detail,
                      icon: "mdi-ticket-percent-outline",
                    },
                    {
                      key: "comment",
                      name: () =>
                        store.state.language[lang.value].pages.product.tabs
                          .comment.title,
                      info: () =>
                        store.state.language[lang.value].pages.product.tabs
                          .comment.detail,
                      icon: "mdi-comment-text-outline",
                    },
                  ]);
                  Object.assign(
                    product,
                    new Object({
                      pid: tmp.pid,
                      title: tmp.pname,
                      cover: store.getters.Media(tmp.cover),
                      tags: tmp.tag.split(","),
                      rating: 2 + Math.round(Math.random() * 30) / 10,
                      prices: tmp.prices,
                      specs: tmp.specs,
                      stocks: tmp.stocks,
                      ship: () =>
                        store.state.language[lang.value].pages.product.subtitle
                          .ship,
                      region:
                        tmp.shipping_region === ""
                          ? () =>
                              store.state.language[lang.value].pages.product
                                .subtitle.region
                          : () => tmp.shipping_region,
                      volume: tmp.volume,
                      store: {
                        sid: tmp.sid,
                        sname: tmp.sname,
                      },
                    })
                  );
                  window.document.title =
                    tmp.pname + " | " + tmp.sname + " - 摸🐟";
                  // console.log(product);
                  status.value = 1;
                } catch (e) {
                  console.error(e);
                }
              } else if (res.data.code === 403) {
                status.value = 2;
                // alert("no result... try another pid");
              } else {
                status.value = 3;
                // alert("something went wrong on the server");
              }
            } else {
              status.value = 4;
              // alert("something went wrong on sending data");
            }
          })
          .catch((e) => {
            status.value = 2;
            console.error(e);
          });
      } else {
        window.location.href = "/";
      }
    }

    const lWords = reactive([
      () => store.state.language[lang.value].pages.product.lWord.loading,
      () => store.state.language[lang.value].pages.product.lWord.no,
      () => store.state.language[lang.value].pages.product.lWord.notfound,
      () => store.state.language[lang.value].pages.product.lWord.servererror,
      () => store.state.language[lang.value].pages.product.lWord.networkerror,
    ]);

    function changeTab(t) {
      tabselected.value = t;
    }

    function selectSpec(t) {
      pselected.value = t;
    }

    const ipt = reactive({
      num: 1,
      changeNum: (t, x) => {
        if (t === 0) {
          ipt.num--;
          ipt.num = Math.max(1, ipt.num);
        } else if (t === 1) {
          ipt.num++;
          ipt.num = Math.min(product.stocks[pselected.value], ipt.num);
        } else if (t === 2) {
          ipt.num = +x.value;
          if (ipt.num <= 0) ipt.num = 1;
          ipt.num = Math.min(product.stocks[pselected.value], ipt.num);
        }
      },
      bottomText: computed({
        get: () => () =>
          store.state.language[lang.value].pages.product.stock(
            product.stocks[pselected.value]
          ),
      }),
    });

    function getCurrentCart() {
      return JSON.parse(
        JSON.stringify({
          pid: product.pid,
          title: product.title,
          store: product.store,
          tags: product.tags,
          region: product.region,
          ship: product.ship,
          num: Math.min(ipt.num, product.stocks[pselected.value]),
          selection: pselected.value,
          price: product.prices,
          spec: product.specs,
          stock: product.stocks,
          cover: product.cover,
          check: false,
        })
      );
    }

    function firstLogin() {
      if (!store.getters.LoginInfo) {
        window.location.href = "/login";
        return true;
      }
      return false;
    }

    const bottomBtns = reactive([
      {
        name: () =>
          store.state.language[lang.value].pages.product.bottomBtns.cart,
        key: "cart",
        color: "orange",
        textColor: "white",
        icon: "mdi-cart",
        free: true,
        click: () => {
          if (firstLogin()) return;
          if (bottomBtns[0].free) {
            let setbtn = (a) => {
              let kw = ["free", "name", "icon", "color"];
              for (let i in kw) bottomBtns[0][kw[i]] = a[i];
            };
            let setbtn2 = (a) => {
              setbtn(a);
              setTimeout(() => {
                setbtn([
                  true,
                  () => (lang.value === 0 ? "加入购物车" : "Add to Cart"),
                  "mdi-cart",
                  "orange",
                ]);
              }, 1000);
            };
            if (store.getters.Cart.num >= 200) {
              setbtn2([
                false,
                () => (lang.value === 0 ? "购物车太满了! " : "Cart's full! "),
                "mdi-alert-circle",
                "error",
              ]);
              return;
            }
            let toCart = getCurrentCart();
            if (toCart.num <= 0) return;
            store.commit("SHOPCART", toCart);
            setbtn2([
              false,
              () => (lang.value === 0 ? "加入成功" : "Success"),
              "mdi-check-decagram",
              "success",
            ]);
          }
        },
      },
      {
        name: () =>
          store.state.language[lang.value].pages.product.bottomBtns.wishlist,
        key: "wishlist",
        color: "teal",
        textColor: "white",
        icon: "mdi-file-star",
        click: () => {
          if (firstLogin()) return;
        },
      },
      {
        name: () =>
          store.state.language[lang.value].pages.product.bottomBtns.purchase,
        key: "purchase",
        color: "red",
        textColor: "white",
        icon: "mdi-circle-slice-8",
        click: () => {
          if (firstLogin()) return;
          ssSto.set("nowBuying", getCurrentCart());
          window.location.href = "/checkout";
        },
      },
    ]);

    function searchByTag(t) {
      store.commit("URLTO", "/search?tag=" + t);
    }

    onBeforeMount(() => {
      getProduct();
    });
    return {
      status,
      pselected,
      product,
      lWords,
      tabselected,
      tabs,
      changeTab,
      // ipt_num,
      selectSpec,
      // changeNum,
      bottomBtns,
      ipt,
      ifPC,
      searchByTag,
    };
  },
};
</script>

<style scoped>
.no-product {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin: 3em;
}
.no-product-word {
  margin: 1.8em;
  font-size: 20px;
}
.PC-view.my-product-card {
  margin: auto;
  margin-top: 1em;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  height: 80vh;
  width: 90vw;
}
.phone-view.my-product-card {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.cover-div {
  width: 50%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.phone-view .cover-div {
  width: 100%;
  height: auto;
}
.cover-div > img:first-child {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  filter: blur(100px);
}
.product-line {
  width: 50%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  padding: 1em;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}
.phone-view .product-line {
  width: 100%;
  height: auto;
  padding: 0;
}
.pro-per-line {
  /* margin: 1em 0; */
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
}
.phone-view .product-line .product-title-tag {
  margin: 0 0 2vw 0 !important;
  padding: 2vw;
  background-color: #ffebee;
  box-shadow: 0 0 3px 0px;
  flex-direction: column;
  align-items: flex-start;
}
.product-title-tag {
  flex-wrap: wrap;
}
.product-line .product-title {
  cursor: default;
  font-size: 1.5em;
  margin: 0;
}
.product-line .product-store {
  cursor: pointer;
  padding: 0;
}
.product-from,
.product-ship {
  cursor: default;
  color: #464646;
}
.product-line .product-prices {
  padding: 0;
  font-size: 2em;
  font-weight: bold;
  cursor: default;
  color: #e53311;
}
.product-line .product-prices .money-tag {
  font-size: 0.8em;
}
.tabs-btn-group {
  width: 100%;
  --under-line-width: 5px;
  box-shadow: inset 0px calc(0px - var(--under-line-width)) 0 0px #81818173;
}
.my-tabs-btn {
  border-radius: 0 !important;
  border-bottom: solid var(--under-line-width) indigo;
}
.product-specs {
  justify-content: flex-start;
  flex-wrap: wrap;
}
.product-specs > button {
  margin-right: 1em;
  margin-bottom: 1em;
}

.bottom-three-buttons {
  color: white !important;
}
.pro-tags {
  white-space: nowrap;
  flex-wrap: wrap;
  display: flex;
}
.pro-tags > span {
  cursor: pointer;
}

.phone-view .product-line .bottom-three-buttons:nth-child(2) {
  position: absolute;
  right: 1vw;
  transform: translateY(-150%);
}
</style>