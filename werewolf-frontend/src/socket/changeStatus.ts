import { GameStatus, TIMEOUT } from "../../shared/GameDefs";
import { ChangeStatusMsg } from "../../shared/WSMsg/ChangeStatus";
import { date, gameStatus, gameStatusTimeLeft, refresh, self } from "../reactivity/game";
import { stopBGAudio } from "../reactivity/audio";

/*  */

export default async function changeStatus(msg: ChangeStatusMsg) {
  // console.log("# changeStatus", { msg });
  date.value = msg.setDay;
  gameStatus.value = msg.setStatus;

  gameStatusTimeLeft.value = msg.timeout || TIMEOUT[msg.setStatus];

  await refresh();

  console.log("---", msg.setStatus);
  if (msg.setStatus === GameStatus.SHERIFF_ELECT) {
    stopBGAudio();
  }

  if (
    msg.setStatus === GameStatus.WOLF_KILL &&
    self.value.character === "WEREWOLF"
  ) {
    // getWolfsNShow();
  } else if (
    msg.setStatus === GameStatus.WITCH_ACT &&
    self.value.character === "WITCH"
  ) {
    // witchGetDieNShow();
  }
}
