<template>
  <Login :tohome="true" id="in-Login" />
</template>

<script>
import Login from "../widgets/login.vue";
export default {
  name: "LoginPage",
  components: { Login },
  setup() {
    return {};
  },
};
</script>

<style scoped>
#in-Login {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>