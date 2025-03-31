import { Middleware } from "koa";

import { IDHeaderName, RoomNumberHeaderName } from "@werewolf/shared";
import { HttpRes } from "@werewolf/shared/httpMsg/_httpResTemplate";
import { GameStatusResponse } from "@werewolf/shared/httpMsg/GameStatusMsg";
import { Room } from "../../models/RoomModel";

/**
 * fe refresh data
 */
const gameStatus: Middleware = async (ctx, next) => {
  const playerID = ctx.get(IDHeaderName);
  const roomNumber = ctx.get(RoomNumberHeaderName);

  const room = Room.getRoom(roomNumber);
  const curPlayer = room.getPlayerById(playerID);
  // console.log("# gameStatus");
  // TODO 不是所有时候都能看到谁死了的

  const ret: HttpRes<GameStatusResponse> = {
    status: 200,
    msg: "ok",
    data: {
      self: { ...curPlayer, isCreator: curPlayer._id === room.creatorID },
      curDay: room.currentDay,
      gameStatus: room.curStatus,
      players: room.isFinished
        ? room.players
        : room.choosePublicInfo(),
    },
  };
  ctx.body = ret;
};

export default gameStatus;
