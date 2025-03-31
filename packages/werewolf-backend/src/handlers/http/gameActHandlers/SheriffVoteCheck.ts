import { Context } from "koa";

import io from "../../..";
import { GameStatus, TIMEOUT, index } from "@werewolf/shared";
import { Player } from "../../../models/PlayerModel";
import { Room } from "../../../models/RoomModel";
import { getVoteResult } from "../../../utils/getVoteResult";
import { GameActHandler, Response, startCurrentState } from "./";
import { BeforeDayDiscussHandler } from "./BeforeDayDiscuss";

export const SheriffVoteCheckHandler: GameActHandler = {
  curStatus: GameStatus.SHERIFF_VOTE_CHECK,

  async handleHttpInTheState(
    room: Room,
    player: Player,
    target: index,
    ctx: Context
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
    BeforeDayDiscussHandler.startOfState(room);
  },
};
