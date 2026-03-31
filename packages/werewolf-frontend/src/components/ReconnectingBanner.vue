<template>
  <Transition name="banner">
    <div v-if="isReconnecting" class="reconnecting-banner">
      <span class="spinner"></span>
      <span>连接已断开，正在重连…</span>
    </div>
    <div v-else-if="justReconnected" class="reconnecting-banner success">
      <span class="checkmark">✓</span>
      <span>已重新连接</span>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { isReconnecting, justReconnected } from "../reactivity/reconnecting";

export default defineComponent({
  name: "ReconnectingBanner",
  setup() {
    return { isReconnecting, justReconnected };
  },
});
</script>

<style lang="scss" scoped>
.reconnecting-banner {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  display: flex;
  align-items: center;
  gap: 0.6rem;

  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 0.875rem;
  padding: 0.5rem 1.2rem;
  border-radius: 2rem;
  white-space: nowrap;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);

  &.success {
    background: rgba(34, 139, 34, 0.85);
  }
}

/* Spinning circle */
.spinner {
  display: inline-block;
  width: 0.85rem;
  height: 0.85rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}

.checkmark {
  font-size: 1rem;
  line-height: 1;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Slide-down / fade transition */
.banner-enter-active,
.banner-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-0.5rem);
}
</style>
