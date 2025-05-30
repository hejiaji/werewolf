import { Context } from "koa";

import io from "../../..";
import { GameStatus, TIMEOUT, index } from "@werewolf/shared";
import { Player } from "../../../models/PlayerModel";
import { Room } from "../../../models/RoomModel";
import { getVoteResult } from "../../../utils/getVoteResult";
import {
  GameActHandler,
  gotoNextStateAfterHandleDie,
  Response,
  startCurrentState,
} from "./";

export const SheriffAssignCheckHandler: GameActHandler = {
  curStatus: GameStatus.SHERIFF_ASSIGN_CHECK,

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
    gotoNextStateAfterHandleDie(room);
  },
};
