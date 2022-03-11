<template>
  <div class="num-ctrl-outer">
    <v-chip
      class="pa-0"
      size="large"
      :color="onlybtn ? 'transparent' : '#263238'"
    >
      <v-btn
        :size="onlybtn ? 'x-small' : 'small'"
        :color="onlybtn ? '#ECEFF1' : 'transparent'"
        icon="mdi-minus"
        elevation="0"
        class="minus-add-btn"
        @click="changeNum(0)"
      ></v-btn>
      <input
        ref="elipt"
        class="num-ipt"
        type="number"
        :value="ipt_num !== undefined ? ipt_num : ipt_num2.num"
        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
        @change="changeNum(2, elipt)"
        :step="step ? setp : 1"
      />
      <v-btn
        :size="onlybtn ? 'x-small' : 'small'"
        :color="onlybtn ? '#ECEFF1' : 'transparent'"
        icon="mdi-plus"
        elevation="0"
        class="minus-add-btn"
        @click="changeNum(1)"
      ></v-btn>
    </v-chip>
    <v-card-text v-if="bottomText" :class="nopadding ? 'pa-0' : 'pa-2'">{{
      bottomText
    }}</v-card-text>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "NumCtrl",
  props: [
    "changeNum",
    "bottomText",
    "ipt_num",
    "step",
    "ipt_num2",
    "nopadding",
    "onlybtn",
  ],
  setup() {
    const elipt = ref(null);
    return { elipt };
  },
};
</script>

<style scoped>
.num-ctrl-outer {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: fit-content;
  flex: 1;
}
input:focus {
  outline: none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.num-ipt {
  width: 3em;
  text-align: center;
}
.minus-add-btn {
  /* border-radius: 50%; */
  color: #545454;
}
</style>