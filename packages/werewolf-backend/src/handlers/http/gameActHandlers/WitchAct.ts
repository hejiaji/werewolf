import { Context } from "koa";

import io from "../../..";
import { GameStatus, TIMEOUT, index } from "@werewolf/shared";
import { createError } from "../../../middleware/handleError";
import { Player } from "../../../models/PlayerModel";
import { Room } from "../../../models/RoomModel";
import { getVoteResult } from "../../../utils/getVoteResult";
import { GameActHandler, Response, startCurrentState } from "./";
import { GuardProtectHandler } from "./GuardProtect";

export const WitchActHandler: GameActHandler = {
  curStatus: GameStatus.WITCH_ACT,

  async handleHttpInTheState(
    room: Room,
    player: Player,
    target: index,
    ctx: Context,
  ) {
    if (
      player.characterStatus?.MEDICINE?.usedDay === room.currentDay ||
      player.characterStatus?.POISON?.usedDay === room.currentDay
    ) {
      createError({
        msg: "一天只能使用一瓶药",
        status: 401,
      });
    }

    if (target < 0) {
      // 杀人
      room.getPlayerByIndex(-target).die = {
        at: room.currentDay,
        fromCharacter: "WITCH",
        fromIndex: [player.index],
      };
      player.characterStatus.POISON = {
        usedAt: -target,
        usedDay: room.currentDay,
      };
    } else if (target > 0) {
      {
        // 救人
        const savedPlayer = room.getPlayerByIndex(target);
        if (
          savedPlayer.die?.fromCharacter === "WEREWOLF" &&
          savedPlayer.die?.at === room.currentDay
        ) {
          // 女巫只能救今天被狼人杀的人
          if (savedPlayer._id === player._id)
            createError({
              msg: "女巫不能自救",
              status: 401,
            });

          // 设置成功救人
          savedPlayer.die.saved = true;
          savedPlayer.isAlive = true;
          player.characterStatus.MEDICINE = {
            usedAt: target,
            usedDay: room.currentDay,
          };
        } else
          createError({
            msg: "女巫只能救今天被狼人杀的人",
            status: 401,
          });
      }
    }

    WitchActHandler.endOfState(room);

    return {
      status: 200,
      msg: "ok",
      data: { target },
    };
  },

  startOfState(room: Room) {
    // 如果没有女巫就直接结束此阶段
    if (!room.needingCharacters.includes("WITCH"))
      return WitchActHandler.endOfState(room);

    startCurrentState(this, room);
  },

  async endOfState(room: Room) {
    GuardProtectHandler.startOfState(room);
  },
};
