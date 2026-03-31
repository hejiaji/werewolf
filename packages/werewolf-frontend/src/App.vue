<template>
  <div class="wrapper" :class="{ dark: theme === DARK }">
    <div class="main">
      <router-view></router-view>
      <Dialog></Dialog>
      <ReconnectingBanner></ReconnectingBanner>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterView } from "vue-router";

import { theme, DARK } from "./reactivity/theme";
import Dialog from "./components/Dialog.vue";
import ReconnectingBanner from "./components/ReconnectingBanner.vue";

const Component = defineComponent({
  name: "App",
  components: {
    RouterView,
    Dialog,
    ReconnectingBanner,
  },
  setup(props) {
    return { theme, DARK };
  },
});

export default Component;
</script>

<style lang="scss" scoped>
.wrapper {
  .main {
    max-width: 30rem;
    margin: auto;
    min-height: 100dvh;
    box-sizing: border-box;
  }
}
</style>
