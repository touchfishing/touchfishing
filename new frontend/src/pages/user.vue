<template>
  <v-navigation-drawer v-if="ifPC" permanent border="none" class="pt-2">
    <v-btn
      class="nav-pane-btns"
      v-for="(item, idx) in navigations.lists"
      :key="idx"
      block
      :color="navigations.cur === +idx ? '#C5CAE9' : 'transparent'"
      :text-color="navigations.cur === +idx ? '#1A237E' : 'black'"
      elevation="0"
      size="large"
      @click="navigations.cur = +idx"
    >
      {{ item.name }}
    </v-btn>
  </v-navigation-drawer>
  <v-main :class="ifPC ? 'PC-view' : 'phone-view'">
    <!-- phone component -->
    <div class="welcome" v-if="navigations.cur === 0">
      <div class="circle-back" v-show="!ifPC"></div>
      <div v-show="!ifPC" class="notifications-and-settings">
        <v-btn icon="mdi-bell" color="white"></v-btn>
        <v-btn icon="mdi-cog" color="white"></v-btn>
      </div>
      <v-card class="postcard-below-avatar" elevation="4" v-show="!ifPC">
        <v-parallax
          height="100%"
          src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
          ><div class="postcard-widget">
            <h2>{{ userinfo.uname }}</h2>
            <h6>{{ navigations.lists[0].days }}</h6>
          </div></v-parallax
        >
      </v-card>

      <!-- avatar -->
      <v-avatar class="avatar-outer"
        ><img style="width: 100%" :src="userinfo.avatar"
      /></v-avatar>

      <!-- welcome -->
      <h1 v-show="ifPC">{{ navigations.lists[0].welcome }}</h1>
      <h2 v-show="ifPC">{{ navigations.lists[0].days }}</h2>

      <v-card v-show="!ifPC" class="mt-10 opacity-9" width="95vw">
        <div class="phone-me-show cus-flex">
          <v-btn
            class="px-2 py-10"
            flat
            v-for="(item, idx) in phoneViewBtns"
            :key="idx"
            @click="item.click"
          >
            <div class="phone-me-show-btn">
              <v-icon>{{ item.icon }}</v-icon>
              <v-card-subtitle class="px-0">{{ item.name }}</v-card-subtitle>
            </div>
          </v-btn>
        </div>
      </v-card>

      <TimeLine class="ma-4" />

      <!-- logout button -->
      <v-btn
        color="orange"
        text-color="white"
        class="mt-6"
        @click="navigations.lists[0].logout.func"
        >{{ navigations.lists[0].logout.txt }}</v-btn
      >
    </div>
    <v-btn
      class="goback-top-btn"
      color="white"
      icon="mdi-chevron-left"
      v-show="!ifPC && navigations.cur !== 0"
      @click="navigations.cur = 0"
    ></v-btn>
    <div class="infos" v-if="navigations.cur === 1 || navigations.cur === 2">
      <v-card class="mt-10 ml-5 mr-5 mb-5 pa-5">
        <div
          class="per-request-ipt"
          v-for="(item, index) in navigations.lists[navigations.cur].infos"
          :key="index"
        >
          <template v-if="item.type === 'text'">
            <v-text-field
              v-model="item.value"
              :label="item.title"
              :disabled="item.disabled ? true : false"
              :prepend-inner-icon="item.icon"
            >
            </v-text-field>
          </template>

          <template v-else-if="item.type === 'text-phone'">
            <v-text-field
              v-model="item.value"
              :label="item.title"
              :prepend-inner-icon="item.icon"
            >
            </v-text-field>
          </template>

          <template v-else-if="item.type === 'password'">
            <v-text-field
              v-model="item.value"
              :label="item.title"
              :prepend-inner-icon="item.icon"
              type="password"
            >
            </v-text-field>
          </template>

          <template v-else-if="item.type === 'textarea'">
            <v-textarea
              v-model="item.value"
              :label="item.title"
              :prepend-inner-icon="item.icon"
              clearable
              no-resize
              counter
            >
            </v-textarea>
          </template>

          <template v-else-if="item.type === 'radio'">
            <v-text-field
              v-model="item.value"
              :label="item.title"
              :prepend-inner-icon="item.icon"
            >
            </v-text-field>
          </template>
        </div>
      </v-card>

      <div
        class="auto-margin cus-flex justify-center"
        style="padding-bottom: 10vh"
      >
        <v-btn>operation</v-btn>
      </div>
      <v-spacer></v-spacer>
    </div>
    <div class="request-open-shop" v-if="navigations.cur === 3">
      <v-card class="mt-10 ml-5 mr-5 mb-5 pa-5">
        <template v-if="navigations.lists[3].nostore">
          <div
            class="per-request-ipt"
            v-for="(it, idx) in navigations.lists[3].infos"
            :key="idx"
          >
            <template v-if="it.type === 'text'">
              <v-text-field
                v-model="it.value"
                :label="it.title"
                :prepend-inner-icon="it.icon"
              >
              </v-text-field>
            </template>
            <template v-else-if="it.type === 'location'">
              <v-text-field
                v-model="it.value"
                :label="it.title"
                :prepend-inner-icon="it.icon"
              >
              </v-text-field>
            </template>
            <template v-else-if="it.type === 'image'">
              <v-file-input
                v-model="it.value"
                accept="image/*"
                :label="it.title"
                :prepend-inner-icon="it.icon"
                @change="fileReader(it.value)"
              ></v-file-input>
              <img
                class="input-img-preview"
                v-if="it.img !== null"
                :src="it.img"
              />
            </template>
          </div>
          <v-btn
            color="primary"
            class="center"
            @click="navigations.lists[3].actions.submit.click"
            >{{ navigations.lists[3].actions.submit.name }}</v-btn
          >
        </template>
        <template v-else>
          <div class="flex-lr">
            <img
              class="input-img-preview"
              :src="navigations.lists[3].infos.avatar"
            />
            <div class="store-infos">
              <div
                v-for="(item, idx) in navigations.lists[3].infos.list"
                :key="idx"
              >
                <v-text-field
                  v-model="item.v"
                  :label="item.k"
                  :readonly="!item.edit"
                ></v-text-field>
              </div>
            </div>
          </div>
          <v-btn
            color="primary"
            class="center"
            @click="navigations.lists[3].infos.action.click"
            >{{ navigations.lists[3].infos.action.name }}</v-btn
          >
        </template>
      </v-card>
    </div>
  </v-main>
</template>

<script>
import TimeLine from "../components/timeline.vue";
import { useStore } from "vuex";
import { reactive, watch, ref } from "vue";
import axios from "axios";

export default {
  name: "userPage",
  components: { TimeLine },
  setup() {
    const store = useStore();
    let userinfo = store.getters.LoginInfo;
    // console.log(userinfo);

    let ifPC = ref(store.state.ifPC);
    watch(
      () => store.state.ifPC,
      (e) => {
        ifPC.value = e;
      }
    );

    let existDate = Math.ceil(
      (new Date().getTime() - new Date(userinfo.create_time).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const sexInfo = ["男", "女", "其他", "保密"];

    const navigations = reactive({
      cur: 0,
      lists: [
        {
          name: "摸🐟渔",
          welcome: `你好，${userinfo.uname}`,
          days: `这是你来到摸渔的第${existDate}天`,
          logout: {
            txt: "退出登录",
            func: () => {
              axios
                .get(store.getters.UrlLogout)
                .then((res) => {
                  if (res.status === 200) {
                    store.dispatch("logout");
                    window.location.reload();
                  }
                })
                .catch((e) => console.error(e));
            },
          },
        },
        {
          name: "个人信息",
          infos: [
            {
              title: "用户ID",
              icon: "mdi-chart-bubble",
              key: "uid",
              type: "text",
              disabled: true,
              value: userinfo.uid,
            },
            {
              title: "昵称",
              icon: "mdi-account-edit",
              key: "uname",
              type: "text",
              value: userinfo.uname,
            },
            {
              title: "性别",
              icon: "mdi-google-circles-extended",
              key: "sex",
              type: "radio",
              value: sexInfo[userinfo.gender],
            },
            {
              title: "邮箱",
              icon: "mdi-email",
              key: "email",
              type: "text",
              value: userinfo.email,
            },
            {
              title: "手机号",
              icon: "mdi-phone",
              key: "phone",
              type: "text-phone",
              value: userinfo.phone,
            },
            {
              title: "密码",
              icon: "mdi-lock",
              key: "password",
              type: "password",
              value: "123456",
            },
            {
              title: "简介",
              icon: "mdi-account-box-outline",
              key: "intro",
              type: "textarea",
              value: userinfo.intro,
            },
          ],
        },
        {
          name: "付款信息",
          infos: [
            {
              title: "收货地址",
              icon: "mdi-map-marker",
              key: "address",
              type: "text",
              value: "null",
            },
            {
              title: "付款方式",
              icon: "mdi-credit-card",
              key: "payment",
              type: "text",
              value: "null",
            },
          ],
        },
        {
          name: "申请开店",
          nostore: true,
          infos: [
            {
              title: "店铺名称",
              icon: "mdi-store",
              type: "text",
              value: null,
            },
            {
              title: "店铺地址",
              icon: "mdi-map",
              type: "location",
              value: null,
            },
            {
              title: "店铺头像",
              icon: "mdi-image",
              type: "image",
              value: [],
              img: null,
            },
          ],
          actions: {
            submit: {
              name: "提交申请",
              click: () => {
                let tmp = navigations.lists[3].infos;
                for (let i = 0; i < 2; i++) {
                  if (
                    tmp[i].value === undefined ||
                    tmp[i].value === null ||
                    tmp[i].value === ""
                  )
                    return;
                }
                let toForm = {
                  sname: tmp[0].value,
                  saddr: tmp[1].value,
                  avatar: tmp[2].value[0],
                  avatar_name:
                    "sp_" +
                    new Date().getTime().toString() +
                    "_" +
                    Math.random().toString(36).substr(2, 9) +
                    "." +
                    tmp[2].value[0].name.split(".").pop(),
                };
                let fd = new FormData();
                for (let i in toForm) {
                  fd.append(i, toForm[i]);
                  // console.log(i, toForm[i]);
                }
                // alert("mmmm");
                axios
                  .post(store.getters.UrlStore("register"), fd, {
                    withCredentials: true,
                    headers: {
                      cookie: store.getters.LoginSession,
                    },
                  })
                  .then((res) => {
                    if (res.data.code === 403) {
                      alert(res.data.msg);
                    } else {
                      store.dispatch("storeInfo", res.data.data);
                      updateStore(res.data.data);
                    }
                  })
                  .catch((e) => console.error(e));
              },
            },
          },
        },
      ],
    });

    const phoneViewBtns = reactive([
      {
        name: "我的订单",
        icon: "mdi-form-select",
        click: () => {
          window.location.href = "/order";
        },
      },
      {
        name: "个人信息",
        icon: "mdi-card-account-details",
        click: () => {
          navigations.cur = 1;
        },
      },
      {
        name: "付款资料",
        icon: "mdi-credit-card-outline",
        click: () => {
          navigations.cur = 2;
        },
      },
      {
        name: "申请开店",
        icon: "mdi-store",
        click: () => {
          navigations.cur = 3;
        },
      },
    ]);

    function updateStore(v) {
      phoneViewBtns[3].name = "我的店铺";
      // phoneViewBtns[3].icon = "mdi-store-check";
      navigations.lists.splice(3, 1, {
        name: "我的店铺",
        infos: {
          avatar: store.getters.Media(v.avatar),
          list: [
            {
              edit: true,
              k: "店铺名称",
              v: v.sname,
            },
            {
              edit: true,
              k: "店铺地址",
              v: v.saddr,
            },
            {
              k: "创建日期",
              v: v.create_time,
            },
          ],
          action: {
            name: "店铺商品管理",
            key: "store-manage",
            click: () => {
              store.commit("URLTO", "/user/store/");
            },
          },
        },
      });
    }

    function checkExistStore() {
      axios
        .get(store.getters.UrlStore("info"), {
          withCredentials: true,
          headers: {
            cookie: store.getters.LoginSession,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            store.dispatch("storeInfo", res.data.data);
            updateStore(res.data.data);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }

    // onBeforeMount(() => {
    //   checkExistStore();
    // });
    if (store.state.store === false) {
      checkExistStore();
    } else {
      updateStore(store.state.store);
    }

    async function fileReader(e) {
      if (e.length) e = e[0];
      function getReader(e) {
        return new Promise((resolve) => {
          var reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(e);
        });
      }
      let res = await getReader(e);
      navigations.lists[3].infos[2].img = res;
    }

    return { navigations, userinfo, fileReader, ifPC, phoneViewBtns };
  },
};
</script>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
}
.nav-pane-btns {
  border-radius: 0 2em 2em 0;
}

.PC-view .avatar-outer {
  width: 300px;
  height: 300px;
}
.phone-view .avatar-outer {
  width: 80vw;
  height: 80vw;
  margin-bottom: 10vw;
}

.input-img-preview {
  max-width: 400px;
  max-height: 400px;
}

.flex-lr {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
.flex-lr .store-infos {
  width: 50%;
}

.phone-view .postcard-below-avatar {
  width: 90vw;
  height: 20vh;
  margin-top: 50vw;
  margin-bottom: -90vw;
}
.phone-view .postcard-below-avatar .postcard-widget {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
}
.phone-view .postcard-below-avatar .postcard-widget h2 {
  display: block;
  width: fit-content;
  padding: 0.3em 0.6em;
  background-color: #f0f8ff6b;
  border-radius: 1em;
}
.phone-view .postcard-below-avatar .postcard-widget h6 {
  color: white;
  width: 100%;
  padding: 1vw;
}

main.phone-view {
  overflow: hidden;
  overflow-y: auto;
  height: 100vh;
  background-color: #ede7f6;
}

.phone-view .circle-back {
  position: absolute;
  width: 125vw;
  height: 200vw;
  border-radius: 50%;
  background-color: #c5cae9;
  left: 10vw;
  top: -45vw;
  transform: rotate(310deg);
  box-shadow: 0px 1px 6px 3px #2423236e;
  z-index: 0;
}
.notifications-and-settings {
  position: absolute;
  width: 100vw;
  left: 0;
  top: 2vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 3vw;
  opacity: 0.7;
  color: #bdbdbd;
}

.phone-me-show-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.phone-view .store-infos {
  width: 100%;
}
</style>