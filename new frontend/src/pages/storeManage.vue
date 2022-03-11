<template>
  <div class="all-on-top" v-show="ctrlShow" @click.self="hideAll">
    <div>
      <AddProduct
        v-if="showCtrl.addProduct"
        :appendNew="appendNew"
        :hideSelf="hideAll"
      />
    </div>
  </div>
  <v-btn
    class="goback-top-btn-right"
    color="white"
    icon="mdi-menu"
    @click="mngMenu = !mngMenu"
  ></v-btn>
  <v-navigation-drawer v-model="mngMenu" border="none" class="pt-2">
    <v-btn
      class="nav-pane-btns"
      v-for="(item, idx) in nav.lists"
      :key="item.key"
      block
      :color="nav.cur === +idx ? '#C5CAE9' : 'transparent'"
      :text-color="nav.cur === +idx ? '#1A237E' : '#424242'"
      elevation="0"
      size="large"
      @click="nav.cur = +idx"
    >
      <v-icon left :icon="'mdi-' + item.icon"></v-icon>
      {{ item.name }}
    </v-btn>
  </v-navigation-drawer>
  <v-main class="main-panel">
    <template v-if="nav.lists[nav.cur].detail.welcome">
      <div class="nav-welcome ma-5">
        <div class="nav-welcome-noti">
          <div>{{ nav.lists[nav.cur].detail.welcome0 }}</div>
          <div>{{ nav.lists[nav.cur].detail.welcome }}</div>
        </div>
        <v-col class="select-up" cols="10" sm="3">
          <v-select
            compact
            :label="nav.lists[nav.cur].detail.overview.filter.label"
            v-model="nav.lists[nav.cur].detail.overview.filter.cur"
            :items="nav.lists[nav.cur].detail.overview.filter.lists"
          ></v-select>
        </v-col>
      </div>
      <div class="info-shortcut ma-5">
        <v-btn
          v-for="it in nav.lists[nav.cur].detail.overview.show"
          :key="it.key"
          size="x-large"
        >
          <div class="icon-outer" :style="{ backgroundColor: it.color[0] }">
            <v-icon :color="it.color[1]" :icon="it.icon"></v-icon>
          </div>
          <div class="info-shortcut-txt">
            <div>{{ it.name }}</div>
            <div>{{ it.value ? it.value : "???" }}</div>
          </div>
        </v-btn>
      </div>
    </template>
    <template v-if="nav.lists[nav.cur].detail.graphs">
      <v-card
        class="ma-5 pa-3"
        v-for="(it, idx) in nav.lists[nav.cur].detail.graphs"
        :key="idx"
      >
        占位符 - 图表
        <template v-if="it.type === 'bar'">{{ it.data }}</template>
      </v-card>
    </template>
    <div class="ma-5" v-if="nav.lists[nav.cur].detail.productList">
      <v-text-field
        label="搜索"
        placeholder="可以输入商品ID、名称"
        variant="plain"
      ></v-text-field>
      <div class="product-operate">
        <v-btn
          :color="it.color"
          v-for="it in storeAll.actions"
          :key="it.key"
          v-show="it.show"
          @click="it.click"
          >{{ it.name }}</v-btn
        >
      </div>
      <v-table fixed-header height="90vh">
        <template v-slot:default>
          <thead>
            <tr>
              <th
                v-for="(it, idx) in productListT"
                :key="idx"
                class="text-left"
              >
                <v-checkbox hide-details v-if="it === 'checkAll'"></v-checkbox>
                <template v-else>{{ it }}</template>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in storeAll.productsP" :key="idx">
              <td v-for="(j, idx2) in productKey" :key="idx2">
                <v-checkbox
                  hide-details
                  v-if="j === 'checkbox'"
                  v-model="it[j]"
                ></v-checkbox>
                <v-img v-else-if="j === 'cover'" :src="it[j]"></v-img>
                <template v-else>{{ it[j] }}</template>
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>
      <v-pagination
        v-model="storeAll.page"
        :length="storeAll.len"
        :total-visible="7"
        rounded="circle"
        @click="pagination"
      ></v-pagination>
    </div>
  </v-main>
</template>

<script>
import { useStore } from "vuex";
import { reactive, computed, ref } from "vue";
import AddProduct from "../widgets/addProduct.vue";
import axios from "axios";

export default {
  components: { AddProduct },
  setup() {
    const store = useStore();
    const info = store.state.store;

    const nav = reactive({
      cur: 0,
      lists: [
        {
          name: "Dashboard",
          key: "dashboard",
          icon: "view-dashboard",
          detail: {
            welcome0: `你好呀, ${store.state.login.uname}!`,
            welcome: (() => {
              let now = new Date().getHours();
              if (now >= 0 && now <= 6) return "夜深了, 别摸了, 🐟留给白天吧";
              else if (now > 6 && now <= 7)
                return "清晨时分, 先享用下可口的早餐";
              else if (now > 7 && now <= 12) return "忙碌的早晨从摸鱼开始";
              else if (now > 12 && now <= 14) return "摸鱼人的闲暇午休";
              else if (now > 14 && now <= 18)
                return "午后, 精力充沛? 昏昏欲睡!";
              else if (now > 18 && now <= 22) return "入夜了, 加班也记得摸鱼啊";
              else if (now > 22 && now <= 24) return "晚安, 明天又是满满的🐟";
            })(),
            overview: {
              filter: {
                cur: "3个月内",
                label: "筛选",
                lists: [
                  "1周内",
                  "1个月内",
                  "3个月内",
                  "半年内",
                  "1年内",
                  "全部",
                ],
              },
              show: [
                {
                  name: "上架商品",
                  key: "productLive",
                  icon: "mdi-apps",
                  color: ["#90caf9", "#5d99c6"],
                  value: null,
                },
                {
                  name: "历史销售",
                  key: "productSales",
                  icon: "mdi-numeric-0-box-multiple",
                  color: ["#4db6ac", "#00867d"],
                  value: null,
                },
                {
                  name: "历史营收",
                  key: "productIncome",
                  icon: "mdi-currency-usd",
                  color: ["#ffb74d", "#c88719"],
                  value: null,
                },
                {
                  name: "当前金额",
                  key: "balance",
                  icon: "mdi-wallet",
                  color: ["#ff8a65", "#c75b39"],
                  value: null,
                },
              ],
            },
            graphs: [
              {
                type: "bar",
                data: null,
              },
            ],
          },
        },
        {
          name: "商品列表",
          key: "products",
          icon: "view-list",
          detail: {
            productList: true,
          },
        },
        {
          name: "销售明细",
          key: "traffic",
          icon: "chart-areaspline",
          detail: {},
        },
        {
          name: "店铺活动",
          key: "sales",
          icon: "sale",
          detail: {},
        },
      ],
    });

    const showCtrl = reactive({
      addProduct: false,
    });
    const ctrlShow = computed({
      get: () => {
        let isshow = false;
        for (let i in showCtrl) {
          if (showCtrl[i] === true) isshow = true;
        }
        return isshow;
      },
    });
    function hideAll() {
      for (let i in showCtrl) showCtrl[i] = false;
    }

    let mngMenu = ref(store.state.ifPC);

    const productListT = reactive([
      "checkAll",
      "编号",
      "ID",
      "标题",
      "封面",
      "标签",
      "规格",
      "售价",
      "库存",
      "销量",
      "更新时间",
      "创建时间",
    ]);
    const productKey = reactive([
      "checkbox",
      "cnt",
      "pid",
      "pname",
      "cover",
      "tag",
      "specs",
      "prices",
      "stocks",
      "volume",
      "update_time",
      "create_time",
    ]);

    function pagination() {
      storeAll.len = Math.ceil(storeAll.products.length / storeAll.items);
      storeAll.productsP = storeAll.products.slice(
        (storeAll.page - 1) * storeAll.items,
        storeAll.page * storeAll.items
      );
    }

    function appendNew(a) {
      storeAll.products.push({
        checkbox: false,
        cnt: storeAll.products.length,
        pid: a.pid,
        pname: a.pname,
        cover: store.getters.Media(a.cover),
        tag: a.tag,
        specs: a.specs.join(", "),
        prices: a.prices.join(", "),
        stocks: a.stocks.join(", "),
        volume: a.volume,
        update_time: a.update_time,
        create_time: a.create_time,
      });
      pagination();
    }

    const storeAll = reactive({
      sinfo: info,
      products: [],
      items: 30,
      page: 1,
      len: 1,
      productsP: [],
      actions: [
        {
          show: true,
          name: "商品上架",
          key: "add",
          color: "#80CBC4",
          click: () => {
            showCtrl.addProduct = true;
          },
        },
      ],
    });

    axios
      .get(store.getters.UrlStoreProducts("list", info.sid), {
        withCredentials: true,
        headers: {
          cookie: store.getters.LoginSession,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          for (let i of res.data.data.items) appendNew(i);
        }
      })
      .catch((e) => {
        console.error(e);
      });

    return {
      nav,
      storeAll,
      showCtrl,
      ctrlShow,
      hideAll,
      appendNew,
      productListT,
      productKey,
      pagination,
      mngMenu,
    };
  },
};
</script>

<style scoped>
.all-on-top {
  position: fixed;
  left: 0;
  top: 0;
  background-color: #00000066;
  z-index: 10000;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.nav-pane-btns {
  border-radius: 0 2em 2em 0;
  justify-content: flex-start;
}
.main-panel {
  height: 100vh;
  background-color: #f5f6f8;
}
.nav-welcome {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.nav-welcome-noti > div:first-child {
  font-size: 20px;
}
.nav-welcome-noti > div:last-child {
  color: #424242;
}
.select-up {
  margin-bottom: -15px;
}
.info-shortcut {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}
.info-shortcut-txt {
  text-align: left;
}
.info-shortcut-txt > div:first-child {
  color: #424242;
  font-size: 14px;
}
/* .info-shortcut-txt > div:last-child {
  font-size: 20px;
} */
.icon-outer {
  border-radius: 50%;
  padding: 5px;
  margin-right: 5px;
}
.all-on-top > div {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100vw;
  max-height: 100vh;
  width: 600px;
  overflow-y: auto;
}
</style>