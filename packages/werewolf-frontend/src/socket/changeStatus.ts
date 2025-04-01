import { GameStatus, TIMEOUT } from "../../shared/GameDefs";
import { ChangeStatusMsg } from "../../shared/WSMsg/ChangeStatus";
import {
  date,
  gameStatus,
  gameStatusTimeLeft,
  refresh,
  self,
} from "../reactivity/game";
import { AUDIO_CATEGORY, playAudio, stopBGAudio } from "../reactivity/audio";

/*  */

export default async function changeStatus(msg: ChangeStatusMsg) {
  // console.log("# changeStatus", { msg });
  date.value = msg.setDay;
  gameStatus.value = msg.setStatus;

  gameStatusTimeLeft.value = msg.timeout || TIMEOUT[msg.setStatus];

  await refresh();

  if (msg.setStatus === GameStatus.SHERIFF_ELECT) {
    stopBGAudio();
  }

  if (!self.value.isCreator) {
    return;
  }

  if (msg.setStatus === GameStatus.WOLF_KILL) {
    playAudio(AUDIO_CATEGORY.WOLF);
  } else if (msg.setStatus === GameStatus.SEER_CHECK) {
    playAudio(AUDIO_CATEGORY.SEER);
  } else if (msg.setStatus === GameStatus.WITCH_ACT) {
    playAudio(AUDIO_CATEGORY.WIZARD);
  } else if (msg.setStatus === GameStatus.HUNTER_CHECK) {
    playAudio(AUDIO_CATEGORY.HUNTER);
  } else if (msg.setStatus === GameStatus.SHERIFF_ELECT) {
    playAudio(AUDIO_CATEGORY.ENDING);
  }
}
