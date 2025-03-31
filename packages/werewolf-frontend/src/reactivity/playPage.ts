import { ref, watch } from "vue";

export const showMemo = ref(false);
export const memoContent = ref("");
watch(memoContent, () => {
  localStorage.setItem("memo", memoContent.value);
});

export const showActions = ref(false);
export const showEvents = ref(false);
export const showCharacter = ref(false);

export const canAct = ref(false);
