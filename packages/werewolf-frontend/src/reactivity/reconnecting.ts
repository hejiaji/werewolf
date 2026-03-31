import { ref } from "vue";

/** True while the WebSocket is trying to reconnect */
export const isReconnecting = ref(false);

/** True for a brief moment after a successful reconnection */
export const justReconnected = ref(false);

let reconnectedTimer: ReturnType<typeof setTimeout> | null = null;

/** Call this when the socket successfully reconnects */
export function flashReconnected() {
  if (reconnectedTimer) clearTimeout(reconnectedTimer);
  justReconnected.value = true;
  reconnectedTimer = setTimeout(() => {
    justReconnected.value = false;
    reconnectedTimer = null;
  }, 2500);
}
