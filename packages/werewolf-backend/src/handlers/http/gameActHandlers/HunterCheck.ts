import { Context } from "koa";

import io from "../../..";
import { GameStatus, TIMEOUT, index } from "@werewolf/shared";
import { Player } from "../../../models/PlayerModel";
import { Room } from "../../../models/RoomModel";
import { GameActHandler, Response, startCurrentState } from "./";
import { SheriffAssignHandler } from "./SheriffAssign";

export const HunterCheckHandler: GameActHandler = {
  curStatus: GameStatus.HUNTER_CHECK,

  async handleHttpInTheState(
    room: Room,
    player: Player,
    target: index,
    ctx: Context,
  ) {
    return {
      status: 200,
      msg: "ok",
      data: { target },
    };
  },

  startOfState(room: Room) {
    startCurrentState(this, room);
  },

  async endOfState(room: Room) {
    SheriffAssignHandler.startOfState(room);
  },
};
