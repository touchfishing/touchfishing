<template>
  <AppBar />
  <TimeLine />
</template>

<script>
import { ref, reactive } from "vue";
import TimeLine from "../components/timeline.vue";
import AppBar from "../components/myAppBar.vue";
export default {
  name: "testPage",
  components: { AppBar, TimeLine },
  setup() {
    let sticky = ref(false);
    let b = reactive({});
    return { sticky, b };
  },
};
</script>

<style>
</style>