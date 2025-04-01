import { ref } from "vue";

import { GameStatus, Potion } from "../../shared/GameDefs";
import { index } from "../../shared/ModelDefs";
import { characterAct } from "../http/action";
import { showDialog } from "./dialog";
import { gameStatus } from "./game";
import { gameRestart } from "../http/room";

const resetAct = () => {
  /* reset */
  isActing.value = false;
  potion.value = undefined;
  target.value = 0;
  noTarget.value = false;
  shouldRestart.value = false;
};

export async function act() {
  if (!!shouldRestart.value) {
    resetAct();
    await gameRestart();
    return;
  }

  if (potion.value === "POISON" && gameStatus.value === GameStatus.WITCH_ACT)
    target.value *= -1;

  const res = await characterAct({
    target: target.value,
  });

  // TODO deal with res

  /* hide dialog */
  isActing.value = false;

  if (res && res.status === 200) {
    if (res.data.isWolf !== undefined) {
      showDialog(`该玩家为${res.data.isWolf ? "狼人" : "人类"}`, 3);
    } else {
      showDialog("操作成功!", 3);
    }
  }
  /* reset */
  resetAct();
}

export const isActing = ref(false);
export const noTarget = ref(false);
export const target = ref<index>(0);
export const potion = ref<Potion>();
export const shouldRestart = ref(false);

export function setTarget(index: index) {
  if (!isActing.value) return;

  target.value = index;
}
