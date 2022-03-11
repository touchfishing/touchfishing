<template>
  <v-card class="pa-4" @click="clearAlertPlus">
    <input type="file" id="customiptaaa" multiple />
    <!-- product title -->
    <v-text-field
      prepend-icon="mdi-subtitles"
      :counter="20"
      maxlength="20"
      label="商品标题"
      required
      v-model="pinfo.pname"
    ></v-text-field>
    <!-- product specs, prices, stocks -->
    <v-row
      class="spe-per"
      v-for="(item, idx) in pinfo.spe"
      :key="idx"
      justify="space-between"
    >
      <v-icon class="ml-3 mt-7" color="#666666"
        >mdi-numeric-{{ idx + 1 }}-circle</v-icon
      >
      <v-col
        :cols="idx2 === 0 ? 4 : 3"
        :md="idx2 === 0 ? 3 : 2"
        v-for="(it, idx2) in speInfo"
        :key="idx2"
      >
        <v-text-field
          v-model="pinfo.spe[idx][idx2]"
          :counter="it.counter"
          :maxlength="it.counter"
          :type="it.type"
          :label="it.label"
          required
        ></v-text-field>
      </v-col>
      <v-icon
        color="#E57373"
        class="mt-7 mr-3"
        v-if="pinfo.spe.length > 1"
        @click="removeSpe(+idx)"
        >mdi-close-circle</v-icon
      >
    </v-row>
    <!-- add more specs... -->
    <v-btn
      text-color="#26A69A"
      color="#E0F2F1"
      prepend-icon="mdi-plus-circle"
      flat
      id="add-more-specs"
      @click="addSpe"
      >添加新规格</v-btn
    >
    <!-- product tags -->
    <v-item-group multiple v-model="pinfo.tag" selected-class="teal">
      <v-icon color="#666666">mdi-tag</v-icon>
      <v-item
        v-for="(it, idx) in tags"
        :key="idx"
        :value="1 + idx"
        v-slot="{ selectedClass, toggle }"
      >
        <v-chip
          :class="selectedClass"
          @click="toggle"
          class="ma-2"
          :color="selectedClass ? '#00796B' : '#666666'"
          :prepend-icon="selectedClass ? 'mdi-checkbox-marked-circle' : ''"
        >
          {{ it }}
        </v-chip>
      </v-item>
    </v-item-group>
    <!-- product detail -->
    <v-textarea
      no-resize
      label="商品信息简述"
      outlined
      rows="3"
      row-height="25"
      shaped
      v-model="pinfo.info"
      prepend-icon="mdi-card-bulleted"
    ></v-textarea>
    <v-row justify="space-between">
      <!-- product cover -->
      <v-col cols="6" md="4">
        <v-file-input
          accept="image/*"
          placeholder="支持 jpg, png 等格式"
          prepend-icon="mdi-image"
          label="商品封面"
          v-model="pinfo.cover"
        ></v-file-input>
      </v-col>
      <v-col cols="6" md="4">
        <!-- product ship region -->
        <v-text-field
          label="发货地"
          prepend-icon="mdi-truck"
          required
          v-model="pinfo.shipping_region"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- alert message -->
    <v-alert
      v-show="alertMsg !== ''"
      id="add-product-alert"
      border="start"
      type="error"
      >{{ alertMsg }}</v-alert
    >
    <!-- button -->
    <v-row class="mb-4" justify="space-around">
      <v-btn color="#26A69A" text-color="white" @click="submitForm" ref="cyes">
        <template v-if="cst === 0">确定</template>
        <template v-else-if="cst === 1"
          ><v-progress-circular
            indeterminate
            color="amber"
          ></v-progress-circular
        ></template>
      </v-btn>
      <v-btn color="#EF5350" text-color="white" @click="hideSelf">取消</v-btn>
    </v-row>
  </v-card>
</template>

<script>
import { reactive, computed, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
export default {
  props: ["hideSelf", "appendNew"],
  setup(props) {
    let cyes = ref(null);
    let cst = ref(0);
    // console.log("mm", props, props.hideSelf);
    const store = useStore();
    const tags = reactive([
      "数码产品",
      "食品",
      "办公类",
      "衣物",
      "家具",
      "家电",
      "汽车",
      "虚拟产品",
      "其他",
    ]);

    //////////
    window.axios = axios;
    window.lllogin = store.getters.LoginSession;
    ///////////

    const pinfo = reactive({
      pname: "",
      info: "",
      tag: [],
      cover: [],
      spe: [["", "", ""]],
      shipping_region: store.state.store.saddr.split(" ")[0],
    });
    const speInfo = reactive([
      {
        label: "规格",
        key: "specs",
        icon: "mdi-format-align-justify",
        counter: 10,
        type: "text",
      },
      {
        label: "价格",
        key: "price",
        icon: "mdi-cash",
        counter: 12,
        type: "number",
      },
      {
        label: "库存",
        key: "stock",
        icon: "mdi-home-analytics",
        counter: 12,
        type: "number",
      },
    ]);

    const canAdd = computed({
      get: () => {
        for (let i of pinfo.spe) {
          if (i.every((e) => e === "")) return false;
        }
        return true;
      },
    });
    function addSpe() {
      if (canAdd.value) {
        pinfo.spe.push(["", "", ""]);
      }
    }
    function removeSpe(a) {
      if (pinfo.spe.length <= 1) return;
      pinfo.spe.splice(a, 1);
    }

    let alertMsg = ref("");
    function clearAlertPlus(e) {
      try {
        if (!e.target.contains(cyes.value.$el)) alertMsg.value = "";
      } catch (er) {
        console.error(er);
      }
    }
    const alertMsgs = {
      pname: "商品标题",
      info: "商品信息描述",
      tag: "商品标签",
      cover: "商品封面",
      spe: "商品规格/价格/库存任一",
      shipping_region: "发货地",
    };
    function checkValid() {
      let check0 = ["pname", "info", "shipping_region"];
      for (let i of check0) {
        if (pinfo[i] === "") {
          alertMsg.value = alertMsgs[i] + "不能为空!";
          return false;
        }
      }
      if (pinfo.cover.length === 0) {
        alertMsg.value = alertMsgs.cover + "不能为空!";
        return false;
      }
      for (let i = pinfo.spe.length - 1; i >= 0; i--) {
        if (i !== 0 && pinfo.spe[i].every((e) => e === "")) {
          pinfo.spe.splice(i, 1);
        }
      }
      for (let i of pinfo.spe) {
        if (i.some((e) => e === "")) {
          alertMsg.value = alertMsgs.spe + "不能为空!";
          return false;
        }
      }
      // tag
      if (pinfo.tag.length === 0) {
        pinfo.tag.push(tags.length);
      }
      return true;
    }

    function tempArr(arr, j) {
      let x = [];
      for (let i of arr) x.push(i[j]);
      return x;
    }

    function submitForm() {
      cst.value = 1;
      if (checkValid()) {
        // generate form
        let fd = new FormData();
        let kw = ["pname", "info", "shipping_region"];
        let kw2 = ["specs", "prices", "stocks"];
        for (let i of kw) {
          fd.append(i, pinfo[i]);
        }
        fd.append("tag", pinfo.tag.map((a) => tags[+a - 1]).join(","));
        fd.append("cover", pinfo.cover[0]);
        for (let i in kw2) {
          fd.append(kw2[i], tempArr(pinfo.spe, i).join(","));
        }
        // post
        axios
          .post(store.getters.UrlStoreProducts("add"), fd, {
            withCredentials: true,
            headers: {
              cookie: store.getters.LoginSession,
            },
          })
          .then((res) => {
            cst.value = 0;
            if (res.data.code === 200) {
              props.appendNew(res.data.data);
              props.hideSelf();
            } else {
              alertMsg.value = res.data.msg;
            }
          })
          .catch((e) => {
            console.error(e);
          });
      } else {
        cst.value = 0;
      }
    }

    return {
      pinfo,
      speInfo,
      addSpe,
      removeSpe,
      canAdd,
      tags,
      submitForm,
      alertMsg,
      clearAlertPlus,
      cyes,
      cst,
    };
  },
};
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

#add-more-specs {
  transform: translate(20px, -40%);
  width: calc(100% - 40px);
}
.spe-per {
  flex-wrap: nowrap;
  animation: flowin 0.6s;
}
@keyframes flowin {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
#add-product-alert {
  margin-top: -30px;
  margin-bottom: 30px;
}
</style>