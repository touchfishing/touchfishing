<template>
  <v-main>
    <v-card
      elevation="8"
      :class="
        'mx-auto pa-5 my-reg-card-outer ' + (ifPC ? 'PC-view' : 'phone-view')
      "
    >
      <div class="card-line left-img">
        <CatFish />
      </div>
      <v-card class="card-line right-ipt">
        <div class="card-loading-my success-register" v-if="ifSuccess">
          <img src="fishicon.svg" class="success-register-icon" />
          <v-card-title>{{ whenSuccess.msg() }}</v-card-title>
          <v-btn color="primary" @click="whenSuccess.action">{{
            whenSuccess.btn_msg()
          }}</v-btn>
        </div>
        <div class="card-loading-my" v-show="ifCurLoading">
          <v-progress-circular
            :size="80"
            :width="8"
            color="purple"
            indeterminate
          ></v-progress-circular>
        </div>
        <v-progress-linear
          v-model="progress"
          color="deep-purple accent-4"
        ></v-progress-linear>
        <v-card-header class="reg-header">{{
          otherWords.register()
        }}</v-card-header>
        <div
          class="per-ipt"
          v-for="(item, idx) in signup"
          :key="'signup_' + idx"
          v-show="idx === steps"
        >
          <v-card-title class="pl-0" v-if="item.welcome().length > 0">{{
            item.welcome()
          }}</v-card-title>
          <div class="ipt-selections" v-if="item.selections">
            <v-btn
              v-for="(it, idx2) in item.selections"
              :key="'spebtn_' + idx2"
              :color="idx2 === sel[item.id] ? '#7E57C2' : '#faf6ff'"
              :text-color="idx2 === sel[item.id] ? 'white' : 'black'"
              flat
              elevation="0"
              class="px-5"
              @click="
                sel[item.id] = +idx2;
                noIpt = true;
              "
              ><v-icon left :icon="it.icon"></v-icon>{{ it.name() }}
            </v-btn>
          </div>
          <div
            class="ipt-per-with-rule"
            v-for="it in item.inputs"
            :key="it.id"
            v-show="it.show(sel[item.id])"
          >
            <VueTelInput
              v-if="it.type === 'tel'"
              v-model="models[it.id]"
              @click="
                it.valishow = true;
                showAlert = false;
              "
              @blur="cVali(validate[it.id](models[it.id]), idx)"
            />
            <div class="avatar-group-selection" v-else-if="it.type === 'radio'">
              {{ it.name() }}
              <div class="group-selection-outer">
                <template v-if="it.optype === 'text'">
                  <v-btn
                    v-for="(r, ridx) in it.opts"
                    :val="it.optype"
                    :key="'opt_' + ridx"
                    :color="models[it.id] === +ridx ? '#7E57C2' : '#faf6ff'"
                    :text-color="models[it.id] === +ridx ? 'white' : 'black'"
                    @click="models[it.id] = +ridx"
                  >
                    {{ r() }}
                  </v-btn>
                </template>
                <template v-else-if="it.optype === 'avatar'">
                  <v-avatar
                    v-for="(r, ridx) in it.opts"
                    :val="models[it.id] === +ridx ? 'se-avatar' : 'de-avatar'"
                    :key="'opt_' + ridx"
                    size="x-large"
                    @click="models[it.id] = +ridx"
                  >
                    <img :src="'avatar/' + r" />
                  </v-avatar>
                </template>
              </div>
            </div>
            <v-textarea
              rows="3"
              no-resize
              v-else-if="it.type === 'info'"
              v-model="models[it.id]"
              background-color="grey lighten-3"
              color="primary"
              :label="it.name()"
            ></v-textarea>
            <v-text-field
              v-else
              v-model="models[it.id]"
              :clearable="it.clearable"
              clear-icon="mdi-close-circle"
              :counter="it.counter > 0 ? it.counter : false"
              :type="it.type"
              :label="it.name()"
              @click="
                if (it.hasOwnProperty('valishow')) it.valishow = true;
                showAlert = false;
              "
              @blur="cVali(validate[it.id](models[it.id]), idx)"
            ></v-text-field>
            <template v-if="it.valishow">
              <v-chip
                v-for="(iv, idd) in it.validation"
                :key="'val_' + idd"
                class="mr-2"
                close
                :color="colorQuery(validate[it.id](models[it.id])[idd])"
                text-color="white"
              >
                <v-avatar
                  left
                  :icon="mapQuery(validate[it.id](models[it.id])[idd])"
                ></v-avatar>
                {{ iv() }}
              </v-chip>
            </template>
            <template v-if="it.alert">
              <v-alert
                v-show="showAlert"
                border="start"
                color="error"
                class="ma-2"
              >
                {{ it.alert() }}
              </v-alert>
            </template>
            <template v-if="it.id === 'captcha'">
              <img
                class="captchaimg"
                :src="captchaSrc"
                @click="captchaSrcClick"
              />
              {{ otherWords.refresh() }}
            </template>
          </div>
          <div class="ipt-agreements" v-if="item.id === 'captchaimg'">
            <v-checkbox
              disabled
              v-model="item.agreements.checked"
              hide-details
            ></v-checkbox>
            <span>{{ item.agreements.txt() }}</span>
          </div>
        </div>
        <v-spacer></v-spacer>
        <div class="next-btns">
          <v-btn class="ml-2" color="primary" @click="clickNext">{{
            nextText
          }}</v-btn>
        </div>
      </v-card>
    </v-card>
  </v-main>
</template>

<script>
// https://www.npmjs.com/package/vue3-tel-input
import { VueTelInput } from "vue3-tel-input";
import "vue3-tel-input/dist/vue3-tel-input.css";

import { reactive, ref, computed, watch } from "vue";
import CatFish from "../components/catFish.vue";
import axios from "axios";
import { useStore } from "vuex";

const avas = [
  "icons8-bald-man-in-green-jacket.svg",
  "icons8-blond-curly-hair-business-lady.svg",
  "icons8-blond-long-hair-business-lady.svg",
  "icons8-brown-curly-hair-lady-in-light-green-shirt.svg",
  "icons8-brown-curly-hair-lady-with-golden-earrings.svg",
  "icons8-brown-hair-business-lady-with-glasses.svg",
  "icons8-brown-long-curly-hair-lady.svg",
  "icons8-brown-long-hair-lady-with-red-glasses.svg",
  "icons8-brown-pigtail-hair-lady.svg",
  "icons8-brown-short-hair-lady-in-yellow-shirt.svg",
  "icons8-business-man-in-yellow-glasses.svg",
  "icons8-indian-lady.svg",
  "icons8-long-curly-hair-lady-with-glasses.svg",
  "icons8-man-in-blue-t-shirt.svg",
  "icons8-man-in-green-sweater.svg",
  "icons8-man-in-green-tie.svg",
  "icons8-man-in-red-jacket.svg",
  "icons8-man-in-striped-shirt.svg",
  "icons8-man-in-white-shirt-2.svg",
  "icons8-man-in-white-shirt.svg",
  "icons8-man-in-yellow-striped-sweater.svg",
  "icons8-man-with-beard-in-suit.svg",
  "icons8-man-with-beard-in-violet-shirt.svg",
  "icons8-man-with-brown-hair-in-green-sweater.svg",
  "icons8-man-with-orange-tie.svg",
  "icons8-man-with-yellow-tie-in-jacket.svg",
  "icons8-red-short-hair-lady-in-yellow-shirt.svg",
  "icons8-short-curly-hair-lady-in-pink-shirt.svg",
  "icons8-short-hair-business-lady-with-glasses.svg",
  "icons8-two-ponytails-hair-lady-with-green-glasses.svg",
];

export default {
  name: "registerPage",
  components: { CatFish, VueTelInput },
  setup() {
    // for pagination
    let steps = ref(0);
    // if currernt is loading something or awaiting something
    let ifCurLoading = ref(false);
    // if successfully register
    let ifSuccess = ref(false);
    // if user not click input before clicking next
    let noIpt = ref(true);
    // if currently show alert
    let showAlert = ref(false);
    // store
    const store = useStore();
    // NOT AVAILABLE
    // const rules = reactive({
    //   required: (value) => !!value || "Required.",
    //   counter: (value) => value.length <= 20 || "Max 20 characters",
    //   email: (value) => {
    //     const pattern =
    //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     return pattern.test(value) || "Invalid e-mail.";
    //   },
    // });
    // user input model
    const models = reactive({
      uname: null,
      email: null,
      phone: null,
      psw: null,
      sex: 3,
      avatar: 0,
      info: null,
      captcha: null,
    });
    // the validation method for input
    const validate = reactive({
      uname: (a) => {
        let b = [false, false, false];
        if (a === null || a === undefined || a.length === 0) return [0, 0, 0];
        if (/^\d+$/.test(a) === false) b[0] = true;
        if (a.length <= 20) b[1] = true;
        // eslint-disable-next-line
        if (/[`!@#$%&_*+\-=\[\]\ {};':"\\|,.<>\/?]/.test(a) === false)
          b[2] = true;
        return b;
      },
      email: (a) => {
        if (a === null || a === undefined || a.length === 0) return [0];
        // eslint-disable-next-line
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(a))
          return [true];
        else return [false];
      },
      phone: (a) => {
        if (a === null || a === undefined || a.length === 0) return [0];
        return [true];
      },
      psw: (a) => {
        if (a === null || a === undefined || a.length === 0) return [0, 0, 0];
        let b = [false, false, false];
        if (a.length >= 8 && a.length <= 32) b[0] = true;
        // eslint-disable-next-line
        if (/[a-z0-9]/.test(a)) b[1] = true;
        // eslint-disable-next-line
        if (/[`!*\[\]\ {}':"\\|\/?]/.test(a) === false) b[2] = true;
        return b;
      },
      sex: () => [true],
      avatar: () => [true],
      info: () => [true],
      captcha: () => [true],
    });
    // user selection sub-tab
    const sel = reactive({
      method: 0,
    });

    var lang = ref(store.state.settings.language);
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.value = e;
      }
    );

    const otherWords = reactive({
      register: () => store.state.language[lang.value].pages.register.register,
      refresh: () => store.state.language[lang.value].pages.register.refresh,
    });

    // all signup methods per page
    const signup = reactive([
      {
        id: "username",
        welcome: () =>
          store.state.language[lang.value].pages.register.w0.welcome,
        inputs: [
          {
            id: "uname",
            name: () =>
              store.state.language[lang.value].pages.register.w0.uname,
            clearable: true,
            type: "text",
            hint: "No space",
            show: () => true,
            validation: [
              () =>
                store.state.language[lang.value].pages.register.w0
                  .validation[0],
              () =>
                store.state.language[lang.value].pages.register.w0
                  .validation[1],
              () =>
                store.state.language[lang.value].pages.register.w0
                  .validation[2],
            ],
            valishow: false,
            alert: () =>
              store.state.language[lang.value].pages.register.w0.alert,
            counter: 20,
          },
        ],
      },
      {
        id: "method",
        welcome: () =>
          store.state.language[lang.value].pages.register.w1.welcome(
            models.uname
          ),
        selections: [
          {
            name: () =>
              store.state.language[lang.value].pages.register.w1.email.name,
            icon: "mdi-email",
          },
          {
            name: () =>
              store.state.language[lang.value].pages.register.w1.phone.name,
            icon: "mdi-cellphone",
          },
          {
            name: () => store.state.language[lang.value].pages.register.w1.both,
            icon: "mdi-expand-all",
          },
        ],
        inputs: [
          {
            id: "email",
            name: () =>
              store.state.language[lang.value].pages.register.w1.email.name,
            clearable: true,
            type: "email",
            show: (a) => a === 0 || a === 2,
            validation: [
              () =>
                store.state.language[lang.value].pages.register.w1.email
                  .validation[0],
            ],
            valishow: false,
            alert: () =>
              store.state.language[lang.value].pages.register.w1.email.alert,
          },
          {
            id: "phone",
            name: () =>
              store.state.language[lang.value].pages.register.w1.phone.name,
            clearable: true,
            type: "tel",
            show: (a) => a === 1 || a === 2,
            validation: [
              () =>
                store.state.language[lang.value].pages.register.w1.phone
                  .validation[0],
            ],
            alert: () =>
              store.state.language[lang.value].pages.register.w1.phone.alert,
            valishow: false,
          },
        ],
      },
      {
        id: "password",
        welcome: () =>
          store.state.language[lang.value].pages.register.w2.welcome,
        inputs: [
          {
            id: "psw",
            name: () =>
              store.state.language[lang.value].pages.register.w2.password,
            clearable: true,
            type: "password",
            show: () => true,
            validation: [
              () =>
                store.state.language[lang.value].pages.register.w2
                  .validation[0],
              () =>
                store.state.language[lang.value].pages.register.w2
                  .validation[1],
              () =>
                store.state.language[lang.value].pages.register.w2
                  .validation[2],
            ],
            valishow: false,
            counter: 32,
          },
        ],
      },
      {
        id: "brief",
        welcome: () =>
          store.state.language[lang.value].pages.register.w3.welcome,
        inputs: [
          {
            id: "sex",
            name: () =>
              store.state.language[lang.value].pages.register.w3.sex.name,
            clearable: false,
            type: "radio",
            show: () => true,
            opts: [
              () => store.state.language[lang.value].pages.register.w3.sex.male,
              () =>
                store.state.language[lang.value].pages.register.w3.sex.female,
              () =>
                store.state.language[lang.value].pages.register.w3.sex.other,
              () =>
                store.state.language[lang.value].pages.register.w3.sex.secret,
            ],
            optype: "text",
          },
          {
            id: "avatar",
            name: () =>
              store.state.language[lang.value].pages.register.w3.avatar.name,
            clearable: true,
            type: "radio",
            show: () => true,
            opts: avas,
            optype: "avatar",
          },
          {
            id: "info",
            name: () =>
              store.state.language[lang.value].pages.register.w3.info.name,
            clearable: true,
            type: "info",
            show: () => true,
          },
        ],
      },
      // {
      //   id: "payment",
      //   welcome: "如果不完善当前信息可以先跳过",
      //   skipable:true,
      //   inputs: [
      //     {
      //       id: "paypsw",
      //       name: "支付密码",
      //       clearable: true,
      //       type: "password",
      //       show: () => true,
      //     },
      //     {
      //       id: "address",
      //       name: "收货地址",
      //       clearable: true,
      //       type: "text",
      //       show: () => true,
      //     },
      //   ],
      // },
      {
        id: "captchaimg",
        welcome: () =>
          store.state.language[lang.value].pages.register.w4.welcome,
        inputs: [
          {
            id: "captcha",
            name: () =>
              store.state.language[lang.value].pages.register.w4.captcha,
            clearable: true,
            type: "text",
            show: () => true,
          },
        ],
        agreements: {
          checked: true,
          txt: () =>
            store.state.language[lang.value].pages.register.w4.agreements,
        },
      },
    ]);

    const valiSteps = reactive(new Array(signup.length).fill(false));
    valiSteps[3] = true; /////////
    watch(steps, (e) => {
      if (e === 3) noIpt.value = false;
    });
    function cVali(a, b) {
      // a is boolean Array [], b is index of tag per page
      valiSteps[b] = a.every((v) => v === true);
      noIpt.value = !valiSteps[b];
    }

    /*
     *  when user click next:
     */
    function clickNext() {
      // if user has input && the input(s) is valid
      if (!noIpt.value && valiSteps[steps.value] === true) {
        // when it comes to communication for checking valid from backend
        if (
          signup[steps.value].id === "username" ||
          signup[steps.value].id === "method"
        ) {
          let toBeCheck = [],
            fd = new FormData(),
            tad = "";
          if (signup[steps.value].id === "username") {
            tad = "username";
            fd.append("value", models.uname);
          } else if (signup[steps.value].id === "method") {
            if (sel.method === 0) {
              tad = "email";
              fd.append("value", models.email);
            } else if (sel.method === 1) {
              tad = "phone";
              fd.append("value", models.phone);
            } else if (sel.method === 2) {
              tad = "email";
              fd.append("value", models.email);
              let fd2 = new FormData();
              fd2.append("value", models.phone);
              toBeCheck.push({
                data: fd2,
                where: "phone",
              });
            }
          }
          toBeCheck.push({
            data: fd,
            where: tad,
          });
          // checking progress
          ifCurLoading.value = true;
          let promises = [];
          let tmpvalid = [];
          for (let i of toBeCheck) {
            promises.push(
              axios({
                method: "post",
                url: store.getters.UrlValid(i.where),
                data: i.data,
                headers: { "Content-Type": "multipart/form-data" },
              })
                .then((res) => {
                  if (res.status === 200) {
                    if (res.data.code === 200) {
                      tmpvalid.push(true);
                    } else {
                      // console.log(res.data);
                      tmpvalid.push(false);
                    }
                  }
                })
                .catch((err) => {
                  console.error(err);
                })
            );
          }
          Promise.all(promises).then(() => {
            if (tmpvalid.every((i) => i === true)) {
              // great, can go to next
              steps.value = (steps.value + 1) % signup.length;
              noIpt.value = true;
            } else {
              // oh, show alert
              showAlert.value = true;
            }
            ifCurLoading.value = false;
          });
        } else if (steps.value === signup.length - 1) {
          // time to register
          ifCurLoading.value = true;
          // store.getters.Encrypt(models.psw).then((epsw) => {
          //   let tmpval = {
          //     uname: models.uname,
          //     email: sel.method === 0 || sel.method === 2 ? models.email : "",
          //     phone: sel.method === 1 || sel.method === 2 ? models.phone : "",
          //     password: epsw,
          //     gender: models.sex,
          //     avatar_name: "avatar/" + avas[models.avatar],
          //     intro: models.info || "",
          //     no_captcha: false,
          //     captcha: models.captcha,
          //   };
          //   let fd = new FormData();
          //   for (const [k0, v0] of Object.entries(tmpval)) {
          //     fd.append(k0, v0);
          //   }
          //   axios({
          //     method: "post",
          //     url: store.getters.UrlRegister,
          //     data: fd,
          //     headers: { "Content-Type": "multipart/form-data" },
          //   })
          //     .then((res) => {
          //       ifCurLoading.value = false;
          //       if (res.status === 200 && res.data.code === 200) {
          //         ifSuccess.value = true;
          //       } else {
          //         alert(res.data.msg); ///////////
          //       }
          //     })
          //     .catch((err) => {
          //       console.error(err);
          //     });
          // });
          let tmpval = {
            uname: models.uname,
            email: sel.method === 0 || sel.method === 2 ? models.email : "",
            phone: sel.method === 1 || sel.method === 2 ? models.phone : "",
            password: store.getters.Encrypt(models.psw),
            gender: models.sex,
            avatar_name: "avatar/" + avas[models.avatar],
            intro: models.info || "",
            no_captcha: false,
            captcha: models.captcha,
          };
          let fd = new FormData();
          for (const [k0, v0] of Object.entries(tmpval)) {
            fd.append(k0, v0);
          }
          axios({
            method: "post",
            url: store.getters.UrlRegister,
            data: fd,
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then((res) => {
              ifCurLoading.value = false;
              if (res.status === 200 && res.data.code === 200) {
                ifSuccess.value = true;
              } else {
                alert(res.data.msg); ///////////
              }
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          // other case directly go
          steps.value = (steps.value + 1) % signup.length;
          noIpt.value = true;
        }
      } else console.error("not all validate"); // no need to inform though
    }

    /*
     *  for input label
     */
    function mapQuery(a) {
      if (a === 0) return "mdi-help-circle";
      if (a === false) return "mdi-close-circle";
      if (a === true) return "mdi-check-circle";
    }
    function colorQuery(a) {
      if (a === 0) return "grey";
      if (a === false) return "red";
      if (a === true) return "teal";
    }
    /*
     *  pagination progress
     */
    let progress = computed(() => {
      if (steps.value === 0) return 20 / signup.length;
      else if (steps.value === signup.length - 1)
        return ((signup.length - 0.3) / signup.length) * 100;
      return (steps.value / signup.length) * 100;
    });
    /*
     *  pagination next button text
     */
    let nextText = computed(() => {
      if (steps.value === signup.length - 1)
        return store.state.language[lang.value].pages.register.begin;
      else return store.state.language[lang.value].pages.register.next;
    });

    /* the img src of captcha */
    function captchaSrcClick() {
      axios
        .get(store.getters.UrlCaptcha + "?t=" + new Date().getTime())
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            captchaSrc.value = "data:image/png;base64," + res.data.data[0].img;
          } else {
            alert(res.data.msg); ///////////
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    let captchaSrc = ref("");
    captchaSrcClick();

    /* when successfully register */
    let whenSuccess = reactive({
      msg: () => store.state.language[lang.value].pages.register.success,
      btn_msg: () => store.state.language[lang.value].pages.register.successmsg,
      action: () => (window.location.href = "/"),
    });

    let ifPC = ref(store.state.ifPC);
    watch(
      () => store.state.ifPC,
      (e) => {
        ifPC.value = e;
      }
    );
    return {
      ifCurLoading,
      signup,
      // rules,
      models,
      sel,
      steps,
      clickNext,
      validate,
      mapQuery,
      colorQuery,
      progress,
      valiSteps,
      cVali,
      noIpt,
      nextText,
      showAlert,
      captchaSrc,
      captchaSrcClick,
      ifSuccess,
      whenSuccess,
      ifPC,
      otherWords,
    };
  },
};
</script>

<style scoped>
.my-reg-card-outer {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 90vh;
  width: 90vw;
  margin-top: 5vh;
  margin-bottom: 4.9vh;
}
.phone-view.my-reg-card-outer {
  flex-direction: column-reverse;
  height: 100vh;
  width: 100vw;
  margin-top: 0;
  margin-bottom: 0;
}
.reg-header {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #4a148c;
  cursor: default;
}
.card-line {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.phone-view .card-line {
  width: 100%;
}
.phone-view .left-img {
  flex: 1;
  margin-top: 2em;
}
.phone-view .right-ipt {
  flex: 3;
}
.ipt-selections {
  box-sizing: border-box;
  width: 100%;
  background-color: #faf6ff;
  border-bottom: solid 2px #ede7f6;
}
.ipt-selections > button {
  border-radius: 0;
  margin-bottom: -2px;
}
.per-ipt {
  padding: 0.2rem 1rem;
  overflow-y: auto;
  height: auto;
  max-height: calc(100% - 8.5em);
}
.ipt-per-with-rule {
  margin-top: 0.8em;
}
.next-btns {
  margin: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

/* loading */
.card-loading-my {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: #ffffffd9;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

/* success */
.success-register {
  background-color: white;
  flex-direction: column;
}
.success-register-icon {
  width: 150px;
  filter: drop-shadow(2px 3px px 3px #00000056);
}

/* captcha */
.captchaimg {
  cursor: pointer;
  margin-right: 0.4em;
}

/* radio buttons */
.avatar-group-selection {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.group-selection-outer {
  margin-left: 0.5em;
}
.group-selection-outer > button {
  margin: 0.5em;
}
.group-selection-outer > .v-avatar {
  cursor: pointer;
  margin: 0.1em;
  transition: 0.4s;
}
.group-selection-outer > .v-avatar[val="de-avatar"] {
  box-shadow: none;
}
.group-selection-outer > .v-avatar[val="se-avatar"] {
  box-shadow: 0 0 4px 3px #7e57c2c2;
}

.ipt-agreements {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.ipt-agreements > div:first-child {
  flex: 0;
}
</style>