<template>
  <v-navigation-drawer v-model="navshow">
    <div class="pa-2">
      <div class="" v-for="item in filterList" :key="item.key">
        <v-card-title>{{ item.name() }}</v-card-title>
        <template v-if="item.type === 'sort2'">
          <div
            class="auto-margin"
            v-for="(it, idx) in item.conditions"
            :key="idx"
          >
            <v-item-group mandatory v-model="it.value">
              <v-item
                v-for="(bi, i) in it.list"
                :key="i"
                v-slot="{ isSelected, toggle }"
                :value="i + 1"
                ><v-chip
                  label
                  class="mr-2 mb-2"
                  :color="isSelected ? 'cyan' : ''"
                  @click="toggle"
                  >{{ bi() }}</v-chip
                ></v-item
              >
            </v-item-group>
          </div>
        </template>
        <template v-else-if="item.type === 'barchart-selection'">
          <div class="mb-4 pri-sel-div">
            <v-avatar class="ava-transform">0</v-avatar>
            <v-item-group v-model="item.sel">
              <v-item
                v-for="(it, i) in item.values"
                :key="i"
                v-slot="{ isSelected, toggle }"
                :value="i + 1"
              >
                <div class="">
                  <v-avatar class="ava-transform">{{ it.range }}</v-avatar>
                  <v-chip
                    class="mr-2 mb-2"
                    :style="{ width: (it.num * 100) / item.total + '%' }"
                    :color="isSelected ? 'red' : 'orange'"
                    @click="toggle"
                  ></v-chip>
                </div>
              </v-item>
            </v-item-group>
          </div>
        </template>
        <template v-else-if="item.type === 'radio-multiple'">
          <v-item-group v-model="item.sel" multiple>
            <v-item
              v-for="(it, i) in item.values"
              :key="i"
              v-slot="{ isSelected, toggle }"
              :value="it"
              ><v-chip
                class="mr-2 mb-2"
                :color="isSelected ? 'cyan' : ''"
                @click="toggle"
                >{{ it }}</v-chip
              ></v-item
            >
          </v-item-group>
        </template>
        <v-divider></v-divider>
      </div>
    </div>
  </v-navigation-drawer>
  <NavBar :showSearch="true" :simpleView="!ifPC" :showornot="showornot" />
  <v-main>
    <div id="main-product">
      <div class="no-product" v-if="status !== 1">
        <v-progress-circular
          v-if="status === 0"
          :size="100"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <div v-else-if="status === 2"></div>
        <div v-else-if="status === 3"></div>
        <div v-else-if="status === 4"></div>
        <span class="no-product-word">{{ lWords[status]() }}</span>
      </div>
      <!-- all product -->
      <div v-if="status === 1" class="all-products" ref="prods">
        <div class="cus-flex flex-start-align">
          <div
            class="cus-flex-column"
            v-for="(ii, id0) in pList"
            :key="+id0 + 1"
          >
            <v-card
              elevation="3"
              class="per-product"
              v-for="item in ii"
              :key="item.pid"
              :width="perpicw"
            >
              <div class="product-cover" @click="toHref(0, item.pid)">
                <v-img :src="item.cover"></v-img>
              </div>
              <div class="product-beyound-pic">
                <div class="product-per-line">
                  <div class="product-price">{{ item.price }}</div>
                  <v-rating
                    v-if="item.rating > 10"
                    class="rec-plist-per-rating"
                    v-model="item.rating"
                    readonly
                    size="x-small"
                    color="yellow-accent-4"
                    half-increments
                    density="compact"
                  ></v-rating>
                </div>
                <div class="product-title" @click="toHref(0, item.pid)">
                  {{ item.pname }}
                </div>
                <v-btn
                  @click="toHref(1, item.store.sid)"
                  block
                  text-color="blue"
                  class="pl-0 pr-0 flex-start my-cus-btn-style"
                  :ripple="false"
                  flat
                  density="compact"
                  prependIcon="mdi-store"
                  >{{ item.store.name }}</v-btn
                >
              </div>
            </v-card>
          </div>
        </div>
        <v-btn
          v-scroll="onScroll"
          v-show="fab"
          class="go-to-top"
          color="primary"
          icon="mdi-chevron-up"
          @click="goToSection(1)"
        ></v-btn>
        <v-pagination
          class="paging"
          v-model="page"
          :length="page_num"
          @click="goToSection"
        ></v-pagination>
      </div>
    </div>
    <!-- recommendation -->
    <v-card class="rec-card">
      <div class="rec-outer">
        <div class="rec-img-div">{{ rec.logo() }}</div>
        <v-divider class="mr-2 ml-2" vertical></v-divider>
        <div class="rec-top-des">
          <span>{{ rec.title() }}</span>
          <v-btn
            flat
            :ripple="false"
            width="fit-content"
            density="compact"
            class="rec-link"
            color="transparent"
            text-color="cyan lighten-2"
            >{{ rec.subtitle() }}</v-btn
          >
        </div>
      </div>
      <div class="rec-outer-detail">
        <div class="rec-top-pic">{{ rec.pic() }}</div>
        <div class="rec-plist">
          <a
            v-for="(item, idx) in rec.list"
            :href="item.href"
            :key="'reclist_' + idx"
          >
            <div class="rec-plist-per-pic">{{ item.pic }}</div>
            <span class="rec-plist-per-title">{{ item.title() }}</span>
            <div class="rec-plist-per-rating-outer">
              <v-rating
                class="rec-plist-per-rating"
                v-model="item.rating"
                readonly
                size="x-small"
                color="yellow-accent-4"
                half-increments
                density="compact"
              ></v-rating>
              <span class="rec-plist-per-total">{{ item.total }}</span>
            </div>
          </a>
        </div>
      </div>
    </v-card>
  </v-main>
</template>

<script>
import {
  onBeforeMount,
  provide,
  ref,
  reactive,
  onUpdated,
  computed,
  watch,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import axios from "axios";
import NavBar from "../components/NavBar.vue";
// hasResult: key to show
export default {
  name: "searchPage",
  components: { NavBar },
  setup() {
    const perPage = 28;
    const prods = ref(null);
    let page = ref(1);
    let perpicw = ref(200);
    let item_num = ref(0);
    let page_num = computed(() => Math.ceil(item_num.value / perPage));
    let kw = ref("");
    let status = ref(0);
    let ajaxResultList = reactive([]);
    let pList = reactive([]);
    const store = useStore();

    var lang = ref(store.state.settings.language);
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.value = e;
      }
    );

    /* 0: loading
       1: found
       2: not found
       3: error on server
       4: network error */
    const rec = reactive({
      logo: () => store.state.language[lang.value].pages.search.rec.logo,
      title: () => store.state.language[lang.value].pages.search.rec.title,
      subtitle: () =>
        store.state.language[lang.value].pages.search.rec.subtitle,
      pic: () => store.state.language[lang.value].pages.search.rec.pic,
      list: [
        {
          pic: "picture_0",
          title: () => store.state.language[lang.value].pages.search.rec.name0,
          href: "#",
          rating: 4.2,
          total: 22349,
        },
        {
          pic: "picture_1",
          title: () => store.state.language[lang.value].pages.search.rec.name1,
          href: "#",
          rating: 3.9,
          total: 4252,
        },
        {
          pic: "picture_2",
          title: () => store.state.language[lang.value].pages.search.rec.name2,
          href: "#",
          rating: 4.1,
          total: 1231,
        },
      ],
    });
    const lWords = reactive([
      () => store.state.language[lang.value].pages.search.lWords[0],
      () => store.state.language[lang.value].pages.search.lWords[1],
      () => store.state.language[lang.value].pages.search.lWords[2],
      () => store.state.language[lang.value].pages.search.lWords[3],
      () => store.state.language[lang.value].pages.search.lWords[4],
    ]);

    /* ----------------------
      if in PC
     */
    let ifPC = ref(store.state.ifPC);
    watch(
      () => store.state.ifPC,
      (e) => {
        ifPC.value = e;
      }
    );
    // ///////////////////////

    /* ----------------------
      control the display of navigation drawler
     */
    let navshow = ref(ifPC.value);
    function showornot() {
      navshow.value = !navshow.value;
    }
    // ///////////////////////

    /* ----------------------
      calculate page list size
     */
    let beforetmp = shapePage().length;
    function shapePage() {
      let tmp = [];
      let tmpw = window.innerWidth;
      let maxw = 220;
      if (!store.state.ifPC && tmpw <= 480) {
        if (tmpw >= 300) {
          tmp = [[], []];
          maxw = tmpw / 2 - 20;
        } else {
          maxw = tmpw - 30;
        }
      } else {
        if (navshow.value && ifPC && tmpw >= 1280) tmpw -= 256;
        let cnt = Math.ceil((tmpw - 20) / maxw);
        maxw = Math.floor((tmpw - 20) / cnt / 10) * 10 - cnt * 4;
        for (let i = 0; i < cnt; i++) tmp.push([]);
      }
      perpicw.value = maxw;
      // beforetmp = tmp.length;
      return tmp;
    }
    // ///////////////////////

    /* ----------------------
      filter result list
     */
    function pPrices() {
      let tmp = [];
      for (let i of ajaxResultList) {
        tmp.push(i.prices[0]);
      }
      tmp.sort((a, b) => a - b);
      if (tmp.length <= 4) {
        let tmp0 = [];
        for (let i of tmp) {
          tmp0.push({ range: i, num: 1 });
        }
        return tmp0;
      }
      // max - min
      let d0 = tmp[tmp.length - 1] - tmp[0];
      let sts = Math.round(d0 / 4);
      let idx0 = 0,
        tmp00 = [0];
      let cnt0 = 0;
      let res = [];
      for (let i of tmp) {
        if (i > tmp00[idx0] && i <= (idx0 + 1) * sts) {
          cnt0++;
        } else {
          tmp00.push(i);
          idx0++;
          res.push({ range: i, num: cnt0 });
          cnt0 = 0;
        }
      }
      return res;

      /* const divnum =
        Math.round(
          Math.sqrt(Math.sqrt(d0, 1 / 2) + d0 / 2, 1 / 3) +
            Math.sqrt(d0, 1 / 2) +
            Math.sqrt(d0, 1 / 3) +
            d0 / 6
        ) + 1;
      // console.log(d0, tmp.length, divnum);
      let div = Math.round(d0 / divnum);
      let divs = [];
      for (let i = 1; i * div < tmp[tmp.length - 1]; i++) {
        divs.push(i * div);
      }
      // divided ranges array
      divs.push(tmp[tmp.length - 1]);
      divs.unshift(-1);
      // the container array of each range [[],[],[]]
      let tmp2 = [[]];
      let idx0 = 0;
      for (let i of tmp) {
        if (divs[idx0] < i && i <= divs[idx0 + 1]) {
          tmp2[idx0].push(i);
        } else {
          tmp2.push([i]);
          idx0++;
        }
      }
      // now processing range
      let tmp3 = [];
      for (let i of tmp2) {
        if (i.length && i.length > 0) {
          tmp3.push({
            arr: i,
            num: i[i.length - 1],
          });
        }
      }
      // console.log(divs, tmp2);
      // for (let i in divs) {
      //   if (tmp2[i].length > 0) {
      //     // sum0 += tmp2[i].length;
      //     tmp3.push({
      //       num: divs[i],
      //       arr: tmp2[i],
      //     });
      //   }
      // }
      console.log(tmp3);
      let tmp4 = [];
      let expt = Math.ceil(tmp3.length / 4);
      for (let i = 0; i < 4; i++) {
        let tcnt = 0;
        let tmax = 0;
        for (let j = i * expt; j < Math.min(tmp3.length, i * expt); j++) {
          tcnt += tmp3[j].arr.length;
          tmax = tmp3[j].num;
        }
        tmp4.push({ range: tmax, num: tcnt });
      }
      return tmp4; */
    }
    // ///////////////////////

    /* ----------------------
      filter result list
     */
    const filterList = reactive([
      {
        name: () =>
          store.state.language[lang.value].pages.search.filterList.sort.name,
        key: "sort",
        type: "sort2",
        conditions: [
          {
            list: [
              () =>
                store.state.language[lang.value].pages.search.filterList.sort
                  .conditions[0][0],
              () =>
                store.state.language[lang.value].pages.search.filterList.sort
                  .conditions[0][1],
              () =>
                store.state.language[lang.value].pages.search.filterList.sort
                  .conditions[0][2],
              () =>
                store.state.language[lang.value].pages.search.filterList.sort
                  .conditions[0][3],
            ],
            value: 0,
          },
          {
            list: [
              () =>
                store.state.language[lang.value].pages.search.filterList.sort
                  .conditions[1][0],
              () =>
                store.state.language[lang.value].pages.search.filterList.sort
                  .conditions[1][1],
            ],
            value: 2,
          },
        ],
      },
      {
        name: () =>
          store.state.language[lang.value].pages.search.filterList.price.name,
        key: "price",
        type: "barchart-selection",
        sel: 0,
        values: [],
        total: 0,
      },
      {
        name: () =>
          store.state.language[lang.value].pages.search.filterList.tag.name,
        key: "tag",
        type: "radio-multiple",
        sel: [],
        values: ["1"],
      },
      {
        name: () =>
          store.state.language[lang.value].pages.search.filterList.region.name,
        key: "region",
        type: "radio-multiple",
        sel: [
          store.state.language[lang.value].pages.search.filterList.region
            .values[0],
        ],
        values:
          store.state.language[lang.value].pages.search.filterList.region
            .values,
      },
    ]);
    watchEffect(() => {
      // c: filterList[0].conditions[1].value    up or down
      // i: keys in object
      const dateFunc = (x) => new Date(x).getTime();
      const sorts = [
        (c, i) => (a, b) => (a[i] - b[i]) * (1 - 2 * c),
        (c, i) => (a, b) => (a[i][0] - b[i][0]) * (1 - 2 * c),
        (c, i) => (a, b) => (dateFunc(a[i]) - dateFunc(b[i])) * (1 - 2 * c),
      ];
      const sortKeys = [
        "pid",
        "prices",
        "volume",
        "create_time",
        "update_time",
      ];
      const sortFuc = [() => {}, sorts[1], sorts[0], sorts[2], sorts[2]];

      let ifFilter = true,
        filterTmp = [];
      if (filterList[1].sel <= 0 || filterList[1].sel === undefined) {
        ifFilter = false;
      } else {
        let fres = [{ range: 0, num: 0 }, ...filterList[1].values];
        let [fmin, fmax] = [
          fres[filterList[1].sel - 1].range,
          fres[filterList[1].sel].range,
        ];
        // console.log("fres", fres, fmin, fmax);
        filterTmp = ajaxResultList.filter(
          (x) => x.prices[0] > fmin && x.prices[0] <= fmax
        );
      }

      if (
        filterList[0].conditions[0].value > 0 &&
        filterList[0].conditions[0].value < sortKeys.length
      ) {
        let [c, i] = [
          filterList[0].conditions[1].value - 1,
          filterList[0].conditions[0].value,
        ];
        // console.log(c, i, sortFuc[i](c, i));
        ajaxResultList.sort(sortFuc[i](c, sortKeys[i]));

        // console.log("sel", filterList[1].sel);
        // ajaxResultList.sort((a, b) => a.prices[0] - b.prices[0]);
        if (page.value !== 1) {
          page.value = 1;
        } else {
          // console.log(ajaxResultList);
          if (ifFilter) {
            // console.log(filterTmp);
            hasResult(0, shapePage(), filterTmp);
          } else {
            hasResult(0, shapePage());
          }
        }
      } else {
        if (ifFilter) {
          hasResult(0, shapePage(), filterTmp);
        }
      }
    });

    /* ----------------------
      handle result, in page x
     */
    function hasResult(pg, tmp, c) {
      // console.log(ajaxResultList);
      if (pg !== undefined && pg !== null && pg > 0) {
        page.value = pg;
      }
      let resL = undefined;
      if (c) resL = c;
      else resL = ajaxResultList;
      let idx = 0;
      let [i, imax] = [
        (page.value - 1) * perPage,
        Math.min(page.value * perPage, item_num.value),
      ];
      if (c) imax = Math.min(page.value * perPage, resL.length);
      for (; i < imax; i++) {
        tmp[idx].push(
          new Object({
            pid: resL[i].pid,
            pname: resL[i].pname,
            price: resL[i].prices[0],
            cover: store.getters.Media(resL[i].cover),
            rating: Math.round(Math.random() * 30) / 10 + 2,
            volumn: resL[i].volumn,
            tag: resL[i].tag,
            store: {
              sid: resL[i].sid,
              name: resL[i].sname,
              region: resL[i].shipping_region,
            },
          })
        );
        idx = (idx + 1) % tmp.length;
      }
      pList.length = 0;
      for (let i of tmp) pList.push(i);
    }
    watch(page, (e) => {
      hasResult(e, shapePage());
    });
    function resizelistener() {
      let tmp = shapePage();
      if (tmp.length !== beforetmp) {
        hasResult(page.value, tmp);
      }
    }
    window.addEventListener("resize", () => {
      resizelistener();
    });
    // ///////////////////////

    /* ----------------------
      search function
     */
    function search() {
      const urlparam = new URL(window.location.href).searchParams;
      const s_kw = urlparam.get("kw");
      const s_tag = urlparam.get("tag");
      if (s_kw !== "" && s_kw !== null && s_kw !== undefined) {
        searchKW(s_kw);
      } else if (s_tag !== "" && s_tag !== null && s_tag !== undefined) {
        searchTag(s_tag);
      } else {
        window.location.href = "/";
      }
    }
    function searchKW(s_kw) {
      kw.value = s_kw;
      provide("sval", kw.value);
      axios
        .get(store.getters.UrlSearchTitle(kw.value))
        .then((res) => {
          if (res.status === 200) {
            // success
            if (res.data.code === 200) {
              if (res.data.data.item_num > 0) {
                searchResult(res.data.data.items);
              } else {
                status.value = 2;
                // alert("no result... try another keyword");
              }
            } else {
              status.value = 3;
              // alert("something went wrong on the server");
            }
          } else {
            // maybe network error
            status.value = 4;
            // alert("something went wrong on sending data");
          }
        })
        .catch((e) => console.error(e));
    }
    function searchTag(s_tag) {
      axios
        .get(store.getters.UrlSearchTag(s_tag))
        .then((res) => {
          if (res.status === 200) {
            // success
            if (res.data.code === 200) {
              if (res.data.data.item_num > 0) {
                searchResult(res.data.data.items);
              } else {
                status.value = 2;
                // alert("no result... try another keyword");
              }
            } else {
              status.value = 3;
              // alert("something went wrong on the server");
            }
          } else {
            // maybe network error
            status.value = 4;
            // alert("something went wrong on sending data");
          }
        })
        .catch((e) => console.error(e));
    }
    function searchResult(r) {
      status.value = 1;
      try {
        page.value = 1;
        item_num.value = r.length;
        Object.assign(ajaxResultList, r);
        hasResult(1, shapePage());
        filterList[1].values = pPrices();
        let tmax = 0;
        for (let i of filterList[1].values) tmax = Math.max(tmax, i.num);
        filterList[1].total =
          Math.round(Math.sqrt(ajaxResultList.length, 1 / 2)) + tmax;
      } catch (e) {
        console.error(e);
      }
    }
    // ///////////////////////

    /* ----------------------
      before mount, update
     */
    onBeforeMount(() => {
      search();
    });
    onUpdated(() => {
      search();
    });
    // ///////////////////////

    /* ----------------------
      scroll to section
     */
    function goToSection(a) {
      if (a && a === 1) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else prods.value.scrollIntoView({ behavior: "smooth" });
    }
    // ///////////////////////

    /* ----------------------
      go to store/product href
     */
    function toHref(ty, ar) {
      let tref = "/product?pid=" + ar;
      if (ty === 1) tref = "/store?sid=" + ar;
      store.commit("URLTO", tref);
      // if (store.state.ifPC) {
      //   window.open(tref);
      // } else {
      //   window.location.href = tref;
      // }
    }
    // ///////////////////////

    /* ----------------------
      scroll to top
     */
    let fab = ref(false);
    function onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      fab.value = top > 20;
    }
    // ///////////////////////

    return {
      kw,
      rec,
      status,
      pList,
      lWords,
      hasResult,
      item_num,
      page,
      page_num,
      goToSection,
      prods,
      toHref,
      ifPC,
      navshow,
      showornot,
      perpicw,
      fab,
      onScroll,
      filterList,
    };
  },
};
</script>

<style scoped>
.rec-card {
  margin: 1em;
  padding: 1em 0.8em 0.8em 0.8em;
}
.rec-outer {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
}
.rec-img-div {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: center;
  background-color: #01579b;
  color: white;
  cursor: pointer;
  width: 200px;
  height: 60px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
.rec-top-des {
  display: flex;
  flex-direction: column;
}
.rec-link {
  padding: 0;
  text-decoration: underline;
}
.rec-top-des span:first-child {
  cursor: default;
  font-size: 1.6em;
}
.rec-outer-detail {
  display: flex;
  flex-direction: row;
  margin: 1em 0;
  height: 8em;
  background-color: #e1f5fe;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
.rec-top-pic {
  --blrw: 30px;
  width: calc(300px - 2 * var(--blrw));
  height: calc(100% - 2 * var(--blrw));
  background-color: #4fc3f7;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  margin: var(--blrw);
  box-shadow: 0 0 30px var(--blrw) #4fc3f7;
}
.rec-plist {
  display: flex;
  flex-direction: row;
  margin-left: 0.6em;
}
.rec-plist > a {
  text-decoration: none;
  color: black;
  list-style: none;
  width: 10.5em;
  margin: 0.3em;
  background-color: white;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
.rec-plist-per-pic {
  width: 100%;
  height: 65%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #81d4fa;
}
.rec-plist-per-title {
  display: block;
  word-break: normal;
  white-space: pre;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  margin: 0.1em;
  font-size: 14px;
}

.rec-plist-per-rating-outer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0.1em;
  font-size: 14px;
}

/* product */
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
.paging {
  width: 100%;
}
.all-products {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.per-product {
  width: 220px;
  margin: 0.5em;
}
.product-cover {
  width: 100%;
  cursor: pointer;
}
.product-beyound-pic {
  margin: 0.3em;
}
.product-per-line {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  justify-content: space-between;
}
.product-price {
  /* float: left; */
  display: inline-block;
  color: #ff5252;
  cursor: default;
  font-weight: 600;
}
.product-price::before {
  font-size: 14px;
  content: "￥";
}
.product-title {
  font-size: 14px;
  display: block;
  word-break: normal;
  white-space: pre-line;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 2.4em;
  line-height: 1.2em;
  cursor: pointer;
}

.my-cus-btn-style {
  text-transform: none;
}

.go-to-top {
  position: fixed;
  right: 5vw;
  bottom: 10vh;
  opacity: 0.8;
}

.ava-transform {
  transform: translateY(1em);
}
.pri-sel-div {
  margin-top: -16px;
}
</style>