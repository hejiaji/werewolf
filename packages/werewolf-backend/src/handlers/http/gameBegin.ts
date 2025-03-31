import { Middleware } from "koa";

import io from "../../";
import { IDHeaderName, RoomNumberHeaderName, GameStatus, Events } from "@werewolf/shared";
import { HttpRes } from "@werewolf/shared/httpMsg/_httpResTemplate";
import { createError } from "../../middleware/handleError";
import { Player } from "../../models/PlayerModel";
import { Room } from "../../models/RoomModel";
import { status2Handler } from "./gameActHandlers";
import { validateIdentity } from "./gameActHandlers/validateIdentity";

/**
 * handle game begin
 */
const gameBegin: Middleware = async (ctx) => {
  const roomNumber = ctx.get(RoomNumberHeaderName);
  const playerID = ctx.get(IDHeaderName);

  const room = Room.getRoom(roomNumber);

  if (room.creatorID !== playerID)
    createError({
      msg: "只有房主才能开始游戏",
      status: 401,
    });

  if (room.players.length !== room.needingCharacters.length)
    createError({
      msg: "房间人数未满, 无法开始游戏",
      status: 401,
    });

  if (room.players.find(x => x.character === undefined)) {
    createError({
      msg: "玩家还未分配角色",
      status: 401,
    });
  }

  // console.log("#game being");
  io.to(roomNumber).emit(Events.GAME_BEGIN);

  // console.log("# roomJoin", "start");
  status2Handler[GameStatus.WOLF_KILL].startOfState(room, false);

  ctx.body = {
    data: {},
    msg: "ok",
    status: 200,
  } as HttpRes;
};

export default gameBegin;
