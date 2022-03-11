<template>
  <div class="pac-fish">
    <div class="mouth"></div>
    <div class="tail"></div>
    <div class="smallfish">🐟</div>
  </div>
</template>

<script>
export default {
  name: "eatFish",
};
</script>

<style scoped>
/* fish body */
.pac-fish {
  --fishw: 125px;
  --fishh: 100px;
  --fishcolor: #1e88e5;
  width: var(--fishw);
  height: var(--fishh);
  /* margin-top: calc(var(--fishh) / 4);
  margin-left: var(--fishw); */
  border-top-left-radius: 100% 50%;
  border-bottom-left-radius: 100% 50%;
  background-color: var(--fishcolor);
  position: relative;
  z-index: 2;
  filter: drop-shadow(1px 2px 2px #123456);
}
/* fish eyeball */
.pac-fish .mouth::after {
  content: "";
  position: absolute;
  right: calc(var(--fishh) * (0.15));
  top: calc(var(--fishh) * (0.15));
  width: calc(var(--fishh) * (0.1));
  height: calc(var(--fishh) * (0.1));
  background-color: black;
  border-radius: 50%;
  z-index: 5;
  border: solid calc(var(--fishh) * (0.02)) white;
  animation: eyescale 2s infinite;
}
/* fish tail */
.pac-fish .tail {
  top: calc(var(--fishh) * (0.16));
  left: calc(var(--fishh) * (0 - 0.25));
  border-radius: 50% var(--fishw);
  transform-origin: bottom;
  animation: waving-top 5s infinite;
  z-index: 2;
}
.pac-fish .tail,
.pac-fish .tail::before {
  position: absolute;
  width: calc(var(--fishh) * (0.6));
  height: calc(var(--fishh) * (0.36));
  background-color: var(--fishcolor);
}
.pac-fish .tail::before {
  content: "";
  top: calc(var(--fishh) * (0.32));
  left: 0;
  border-radius: var(--fishw) 50%;
  transform-origin: top;
  animation: waving-bottom 5s infinite;
}

/* fish head */
.pac-fish .mouth {
  position: absolute;
  right: calc(var(--fishh) * (0 - 0.5));
  top: 0;
  border-radius: 50%;
  margin: 0 auto;
  border-radius: 50% 50% 0 0;
  transform-origin: bottom;
  -webkit-animation: eating-top 2s infinite;
  animation: eating-top 2s infinite;
}
.pac-fish .mouth,
.pac-fish .mouth::before {
  width: var(--fishh);
  height: calc(var(--fishh) / 2);
  background: var(--fishcolor);
  z-index: 2;
}
.pac-fish .mouth::before {
  content: "";
  display: block;
  margin-top: calc(var(--fishh) / 2);
  position: absolute;
  transform-origin: top;
  border-radius: 0 0 50% 50%;
  transform: rotate(80deg);
  -webkit-animation: eating-bottom 2s infinite;
  animation: eating-bottom 2s infinite;
}

/* fish to eat */
.pac-fish .smallfish {
  position: absolute;
  left: calc(var(--fishw) * 0.2);
  top: calc(var(--fishh) * (0 - 0.2));
  margin-left: var(--fishw);
  margin-top: calc(var(--fishh) * 0.5);
  z-index: 1;
  font-size: calc(var(--fishh) * 0.3);
  animation: eaten 2s -2s infinite linear;
}
.pac-fish .smallfish::before,
.pac-fish .smallfish::after {
  content: "🐟";
  position: absolute;
  animation: eaten2 2s infinite linear;
}
.pac-fish .smallfish::before {
  left: calc(var(--fishw) * 0.6);
}
.pac-fish .smallfish::after {
  left: calc(var(--fishw) * 1);
}

@-webkit-keyframes eating-top {
  0% {
    transform: rotate(-40deg);
  }
  50% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-40deg);
  }
}
@keyframes eating-top {
  0% {
    transform: rotate(-40deg);
  }
  50% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-40deg);
  }
}
@-webkit-keyframes eating-bottom {
  0% {
    transform: rotate(80deg);
  }
  50% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(80deg);
  }
}
@keyframes eating-bottom {
  0% {
    transform: rotate(80deg);
  }
  50% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(80deg);
  }
}

@keyframes waving-top {
  0%,
  100% {
    transform: rotate(-20deg);
  }
  50% {
    transform: rotate(20deg);
  }
}
@keyframes waving-bottom {
  0%,
  100% {
    transform: rotate(40deg);
  }
  50% {
    transform: rotate(-40deg);
  }
}
@keyframes eyescale {
  0%,
  100% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
}
@keyframes eaten {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(-200%);
  }
}
@keyframes eaten2 {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-150%);
  }
}
</style>