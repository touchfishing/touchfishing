<template>
  <v-form ref="form" @submit.prevent="validate" class="outer-form">
    <div class="login-img">
      <img class="pointer" @click="handleIcon" src="fishicon.svg" />
    </div>
    <v-text-field
      @click="loading = loading !== 2 ? 0 : 2"
      :label="inputLabel.account.label()"
      prepend-icon="mdi-account"
      v-model="inputInfo.account"
      required
    ></v-text-field>

    <v-text-field
      @click="loading = loading !== 2 ? 0 : 2"
      :label="inputLabel.psw.label()"
      prepend-icon="mdi-lock"
      type="password"
      v-model="inputInfo.psw"
      required
    ></v-text-field>
    <v-alert v-show="loading === 3" border="start" color="error">
      {{ alertMsg }}
    </v-alert>
    <div class="text-center ma-4">
      <v-btn color="primary" large type="submit" rounded block>
        <template v-if="loading === 0">{{ somethingMore.login() }}</template>
        <template v-else-if="loading === 1"
          ><v-progress-circular
            indeterminate
            color="white"
          ></v-progress-circular
        ></template>
        <template v-else-if="loading === 2"
          ><v-icon>mdi-check-bold</v-icon></template
        >
        <template v-else-if="loading === 3"
          ><v-icon>mdi-close-thick</v-icon></template
        >
      </v-btn>
    </div>
    <!-- forget psw or to signup -->
    <div class="text-center ma-4 mb-1">
      <v-btn flat :ripple="false" color="transparent">{{
        moreBtn.forget.text()
      }}</v-btn>
      <v-divider inset vertical></v-divider>
      <v-btn
        flat
        :ripple="false"
        color="transparent"
        @click="moreBtn.register.action"
        >{{ moreBtn.register.text() }}</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";
// import axios from "axios";

export default {
  name: "loginWidget",
  props: ["exit", "tohome"],
  setup(props) {
    const store = useStore();

    var lang = ref(store.state.settings.language);
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.value = e;
      }
    );

    const form = ref(null);
    const inputLabel = reactive({
      account: {
        label: () => store.state.language[lang.value].widgets.login.account,
        rules: [(v) => !!v || "account is required"],
      },
      psw: {
        label: () => store.state.language[lang.value].widgets.login.password,
        rules: [(v) => !!v || "password is required"],
      },
    });
    let inputInfo = reactive({
      account: null,
      psw: null,
    });
    /* loading:
      0: not input
      1: sending ajax
      2: successfully login
      3: error info
    */
    let loading = ref(0);
    let alertMsg = ref("");

    let moreBtn = reactive({
      forget: {
        text: () => store.state.language[lang.value].widgets.login.forget,
      },
      register: {
        text: () => store.state.language[lang.value].widgets.login.register,
        action: () => {
          store.commit("URLTO", "/register");
        },
      },
    });

    async function validate() {
      if (
        inputInfo.account !== null &&
        inputInfo.account !== "" &&
        inputInfo.psw !== null &&
        inputInfo.psw !== ""
      ) {
        loading.value = 1; // loading...
        await login(inputInfo.account, inputInfo.psw);
      }
    }

    async function login(a, b) {
      let psw = store.getters.Encrypt(b);
      let tPost = {
        user: a,
        password: psw,
        no_captcha: true,
      };
      let fd = new FormData();
      for (const [k0, v0] of Object.entries(tPost)) {
        fd.append(k0, v0);
      }
      fetch(store.getters.UrlLogin, {
        method: "post", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        // headers: {
        //   "Content-Type": "multipart/form-data",
        //   // 'Content-Type': 'application/x-www-form-urlencoded',
        // },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: fd, // body data type must match "Content-Type" header
      })
        .then((res) => res.json())
        .then(function (response) {
          // console.log("res", response, response.json());
          handleLogin(response);
        })
        .catch(function (e) {
          console.error(e);
        });
      // axios
      //   .post(store.getters.UrlLogin, fd, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //     withCredentials: true,
      //   })
    }

    function handleLogin(d) {
      if (d.code === 403) {
        //请使用 POST 请求\|无效参数\|无此用户\|密码错误\|请输入验证码\|验证码过期\|验证码错误
        alertMsg.value = d.msg;
        loading.value = 3;
      } else if (d.code === 500) {
        alertMsg.value = d.msg;
        loading.value = 3;
        // 服务器错误
        console.error(d.msg, "error on server");
      } else if (d.code === 200) {
        // success
        loading.value = 2;
        store.dispatch("userLogin", d.data);
        setTimeout(() => {
          if (props.tohome) {
            window.location.href = "/";
          } else {
            props.exit(0);
            window.location.reload();
          }
        }, 500);
      }
    }

    function handleIcon() {
      if (props.tohome) {
        window.location.href = "/";
      } else {
        props.exit(0);
      }
    }

    const somethingMore = reactive({
      login: () => store.state.language[lang.value].widgets.login.login,
    });

    return {
      form,
      inputInfo,
      inputLabel,
      loading,
      moreBtn,
      validate,
      alertMsg,
      handleIcon,
      somethingMore,
    };
  },
};
</script>

<style scoped>
.outer-form {
  background-color: white;
  width: 25em;
  max-width: 98vw;
  padding: 1.5em;
  border-radius: 0.2em;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
.login-img {
  margin: 0 0 2em 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;
}
.login-img img {
  width: 150px;
  filter: drop-shadow(2px 3px 3px #00000056);
}
</style>