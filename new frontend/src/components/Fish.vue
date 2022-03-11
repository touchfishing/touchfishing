<template>
  <div class="fish">
    <div class="fish-body">
      <div class="eye">
        <div class="pupil"></div>
      </div>
    </div>
    <div class="fin"></div>
    <div class="fin fin-bottom"></div>
  </div>
</template>

<script>
export default {
  name: "FishFish",
};
</script>

<style scoped>
/* Franklin's Container */
.fish {
  width: 150px;
  height: 100px;
  filter: drop-shadow(1px 3px 2px #00000066);
}

/* Franklin */
.fish-body {
  position: relative;
  margin-top: 30px;
  margin-left: 40px;
  background-color: #41acf3;
  border-radius: 50%;
  width: 150px;
  height: 100px;
}

.eye {
  position: absolute;
  margin-left: 100px;
  margin-top: 20px;
  z-index: 1;
  background-color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: pulse 4s linear infinite;
}

.pupil {
  position: absolute;
  z-index: 2;
  margin-left: 5px;
  margin-top: 5px;
  background-color: black;
  border-radius: 50%;
  height: 10px;
  width: 10px;
}

.fin {
  margin-top: -100px;
  background-color: #41acf3;
  border-radius: 50%;
  transform: rotate(40deg);
  width: 80px;
  height: 50px;
  animation: shaking1 3s linear infinite;
}

.fin-bottom {
  margin-top: -10px;
  transform: rotate(-40deg);
  animation: shaking2 3s linear infinite;
}

@keyframes pulse {
  0% {
    transform: scale(70%);
  }
  50% {
    transform: scale(100%);
  }
  100% {
    transform: scale(70%);
  }
}
@keyframes shaking1 {
  0% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(15deg);
  }
}
@keyframes shaking2 {
  0% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(-45deg);
  }
  100% {
    transform: rotate(-15deg);
  }
}
</style>