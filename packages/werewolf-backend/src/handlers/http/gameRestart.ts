import { Middleware } from "koa";

import { IDHeaderName, RoomNumberHeaderName, Events } from "@werewolf/shared";
import { createError } from "../../middleware/handleError";
import { Room } from "../../models/RoomModel";
import { status2Handler } from "./gameActHandlers";
import io from "../../index";
import { HttpRes } from "@werewolf/shared/httpMsg/_httpResTemplate";

const gameRestart: Middleware = async (ctx) => {
  const roomNumber = ctx.get(RoomNumberHeaderName);
  const playerID = ctx.get(IDHeaderName);

  const room = Room.getRoom(roomNumber);
  if (room.creatorID !== playerID)
    createError({
      msg: "只有房主才能重新开始游戏",
      status: 401,
    });

  room.reset();

  // console.log("#game being");
  io.to(roomNumber).emit(Events.GAME_RESTART);

  ctx.body = {
    data: {},
    msg: "ok",
    status: 200,
  } as HttpRes;
};

export default gameRestart;
