import { Context } from "koa";

import { GameStatus, TIMEOUT, index } from "@werewolf/shared";
import { Player } from "../../../models/PlayerModel";
import { Room } from "../../../models/RoomModel";
import { GameActHandler, Response, startCurrentState } from "./";
import { ExileVoteHandler } from "./ExileVote";

export const DayDiscussHandler: GameActHandler = {
  curStatus: GameStatus.DAY_DISCUSS,

  async handleHttpInTheState(
    room: Room,
    player: Player,
    target: index,
    ctx: Context,
  ) {
    room.toFinishPlayers.delete(player.index);

    if (room.toFinishPlayers.size === 0) {
      clearTimeout(room.timer);
      DayDiscussHandler.endOfState(room);
    }
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
    room.nextStateOfDieCheck = GameStatus.WOLF_KILL;
    ExileVoteHandler.startOfState(room);
  },
};
