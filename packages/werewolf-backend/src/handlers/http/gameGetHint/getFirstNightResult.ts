import { Middleware } from "koa";

import { IDHeaderName, RoomNumberHeaderName } from "@werewolf/shared";
import { createError } from "../../../middleware/handleError";
import { Room } from "../../../models/RoomModel";

export const getFirstNightResult: Middleware = async (ctx) => {
  const roomNumber = ctx.get(RoomNumberHeaderName);
  const playerID = ctx.get(IDHeaderName);

  const room = Room.getRoom(roomNumber);
  const player = room.getPlayerById(playerID);

  if (player._id !== room.creatorID)
    createError({ status: 401, msg: "你的身份无法查看此消息" });

  const dyingPlayers = room.players.filter((p) => {
    // 女巫救活了就没有 p.die?.fromCharacter 字段
    const isKilledLastNight =
      p.die?.at === room.currentDay - 1 && !p.die?.saved;
    return isKilledLastNight;
  });

  const ret = {
    status: 200,
    msg: "ok",
    data: "",
  };

  if (dyingPlayers.length === 0) {
    ret.data = "昨晚是个平安夜";
  } else {
    const dyingNumbers = dyingPlayers.map((x) => `${x.index}号`).join(",");
    ret.data = `昨晚死亡的是: ${dyingNumbers}`;
  }

  ctx.body = ret;
};
