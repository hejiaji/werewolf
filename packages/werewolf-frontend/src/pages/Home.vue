<template>
  <div class="main-page">
    <img :src="`./assets/werewolf${theme}.svg`" alt="logo" class="logo" />

    <div class="title">狼人杀大法官</div>
    <Btn @click="$router.push('joinRoom')" content="加入房间"></Btn>
    <Btn @click="$router.push('createRoom')" content="创建房间"></Btn>
    <!--    <Btn @click="$router.push('review')" content="游戏记录"></Btn>-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { theme } from "../reactivity/theme";

import Btn from "../components/Btn.vue";

const Home = defineComponent({
  name: "Home",
  components: { Btn },
  setup(props) {
    return { theme };
  },
});
export default Home;
</script>

<style lang="scss" scoped>
@font-face {
  font-family: gete;
  src: url("/assets/gete.ttf");
}

.main-page {
  .logo {
    padding-top: 10vh;
    width: 18vh;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  .title {
    margin: 7vh auto 0;
    text-align: center;
    font-size: 3rem;
    font-weight: bolder;
    font-family: gete;
  }

  .btn {
    display: block;
    margin: 7vh auto 0;
    text-align: center;
  }
}
</style>
