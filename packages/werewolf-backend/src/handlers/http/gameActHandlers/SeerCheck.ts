import { Context } from "koa";

import { GameStatus, TIMEOUT, index } from "@werewolf/shared";
import { HttpRes } from "@werewolf/shared/httpMsg/_httpResTemplate";
import { SeerCheckData } from "@werewolf/shared/httpMsg/SeerCheckMsg";
import { createError } from "../../../middleware/handleError";
import { Player } from "../../../models/PlayerModel";
import { Room } from "../../../models/RoomModel";
import { GameActHandler, Response, startCurrentState, status2Handler } from "./";
import { WitchActHandler } from "./WitchAct";

export const SeerCheckHandler: GameActHandler = {
  curStatus: GameStatus.SEER_CHECK,

  async handleHttpInTheState(
    room: Room,
    player: Player,
    target: index,
    ctx: Context
  ) {
    const targetPlayer = room.getPlayerByIndex(target);

    if (!targetPlayer)
      createError({ status: 400, msg: "未找到此玩家" });
    if (player.characterStatus?.checks?.[room.currentDay])
      createError({ status: 400, msg: "一天只能查验一次" });

    const isWolf = targetPlayer.character === "WEREWOLF";

    player.characterStatus.checks =
      player.characterStatus.checks || [];
    player.characterStatus.checks[room.currentDay] = {
      index: target,
      isWerewolf: isWolf,
    };

    SeerCheckHandler.endOfState(room);

    const ret: HttpRes<SeerCheckData> = {
      data: {
        isWolf,
      },
      msg: "ok",
      status: 200,
    };
    return ret;
  },

  startOfState(room: Room) {
    // 如果没有预言家就直接结束此阶段
    if (!room.needingCharacters.includes("SEER"))
      return SeerCheckHandler.endOfState(room);

    startCurrentState(this, room);
  },

  async endOfState(room: Room) {
    WitchActHandler.startOfState(room);
  },
};
