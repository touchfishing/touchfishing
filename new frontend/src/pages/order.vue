<template>
  <v-main>
    <div class="very-center" v-if="showtxt.status <= 2">
      <v-progress-circular
        v-if="showtxt.status === 0"
        :size="200"
        :width="10"
        color="indigo darken-2"
        indeterminate
      ></v-progress-circular>
      <v-alert
        v-else-if="showtxt.status === 1"
        border="start"
        color="error"
        type="error"
      >
        {{ showtxt.msg }}
      </v-alert>
      <template v-else-if="showtxt.status === 2">{{
        checkOrderStatus.empty()
      }}</template>
    </div>
    <v-card
      v-else-if="showtxt.status === 3"
      elevation="8"
      width="90vw"
      color="#E8EAF6"
      class="order-card-outer"
    >
      <v-card
        class="auto-margin"
        elevation="2"
        v-for="item in orders"
        :key="item.oid"
      >
        <div class="auto-padding-x auto-padding-y-min cus-flex">
          <v-card-title class="px-0"
            ><v-icon>mdi-store</v-icon>{{ item.sname }}</v-card-title
          >
          <span>{{ item.create_time }}</span>
        </div>
        <v-divider></v-divider>

        <div class="cus-flex auto-padding">
          <div
            class="cus-flex no-wrap-flex flex-2 pointer"
            @click="openPage('product?pid=' + item.pid)"
          >
            <div class="checkout-img"><img /></div>
            <div class="mx-2 flex-2">{{ item.pname }}</div>
          </div>
          <div class="cus-flex">
            <v-chip
              class="my-1"
              color="indigo"
              prepend-icon="mdi-label"
              append-
            >
              {{ item.spec }}
              <template v-slot:append
                ><v-avatar color="#BBDEFB">{{
                  item.quantity
                }}</v-avatar></template
              >
            </v-chip>
            <span class="ml-3">{{ item.price }}</span>
          </div>
        </div>
        <v-divider></v-divider>

        <div class="cus-flex auto-padding">
          <v-chip :color="checkOrderStatus.color[item.status]">{{
            checkOrderStatus.txt()[item.status]
          }}</v-chip>
          <div class="btngrps">
            <v-btn
              color="primary"
              rounded
              class="ml-2"
              v-for="vb in btns"
              :key="vb.key"
              @click="vb.click"
              >{{ vb.name() }}</v-btn
            >
          </div>
        </div>
      </v-card>
    </v-card>
  </v-main>
</template>

<script>
import axios from "axios";
import { useStore } from "vuex";
import { reactive, ref, watch } from "vue";
export default {
  name: "orderPage",
  components: {},
  setup() {
    const store = useStore();
    const showtxt = reactive({
      status: 0,
      msg: "",
    });
    const orders = reactive([]);
    axios
      .get(store.getters.UrlOrder("list"), {
        withCredentials: true,
        headers: {
          cookie: store.getters.LoginSession,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          if (res.data.code === 200) {
            showtxt.status = 2;
            showtxt.msg = res.data.msg;
            Object.assign(orders, res.data.data.orders);
            if (orders.length > 0) {
              showtxt.status = 3;
            }
          } else {
            showtxt.status = 1;
            showtxt.msg = res.data.msg;
          }
        } else {
          showtxt.status = 1;
          showtxt.msg = "network error";
        }
      });

    var lang = ref(store.state.settings.language);
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.value = e;
      }
    );

    const checkOrderStatus = reactive({
      txt: () => store.state.language[lang.value].pages.order.checkOrderStatus,
      color: ["red", "orange", "blue", "green", "teal"],
      empty: () => store.state.language[lang.value].pages.order.empty,
    });

    const btns = reactive([
      {
        name: () => store.state.language[lang.value].pages.order.btns.detail,
        key: "detail",
        click: () => {},
      },
      {
        name: () => store.state.language[lang.value].pages.order.btns.delivery,
        key: "delivery",
        click: () => {},
      },
      {
        name: () => store.state.language[lang.value].pages.order.btns.confirm,
        key: "confirm",
        click: () => {},
      },
    ]);

    function openPage(a) {
      store.commit("URLTO", a);
    }

    return { showtxt, orders, checkOrderStatus, btns, openPage };
  },
};
</script>

<style scoped>
.order-card-outer {
  margin: auto;
  margin-top: 5vh;
}
</style>