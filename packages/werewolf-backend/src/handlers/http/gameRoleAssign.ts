import { Middleware } from "koa";

import io from "../../";
import { IDHeaderName, RoomNumberHeaderName, Events } from "@werewolf/shared";
import { HttpRes } from "@werewolf/shared/httpMsg/_httpResTemplate";
import { createError } from "../../middleware/handleError";
import { Room } from "../../models/RoomModel";

/**
 * handle game begin
 */
const gameRoleAssign: Middleware = async (ctx) => {
  const roomNumber = ctx.get(RoomNumberHeaderName);
  const playerID = ctx.get(IDHeaderName);

  const room = Room.getRoom(roomNumber);
  if (room.creatorID !== playerID)
    createError({
      msg: "只有房主才能分配角色",
      status: 401,
    });

  if (room.players.length !== room.needingCharacters.length)
    createError({
      msg: "房间人数未满, 无法分配角色",
      status: 401,
    });

  // console.log("#game being");
  // assign characters
  const needingCharacters = [...room.needingCharacters];

  for (let p of room.players) {
    const index = Math.floor(Math.random() * needingCharacters.length);
    const character = needingCharacters.splice(index, 1)[0];

    p.character = character;
    switch (character) {
      case "GUARD":
        p.characterStatus = {
          protects: [],
        };
        break;
      case "HUNTER":
        p.characterStatus = {
          shootAt: {
            day: -1,
            player: -1,
          },
        };
        break;
      case "SEER":
        p.characterStatus = {
          checks: [],
        };
        break;
      case "WEREWOLF":
        p.characterStatus = {
          wantToKills: [],
        };
        break;
      case "WITCH":
        p.characterStatus = {
          POISON: { usedDay: -1, usedAt: -1 },
          MEDICINE: { usedDay: -1, usedAt: -1 },
        };
        break;
      case "VILLAGER":
        p.characterStatus = {};
      default:
        break;
    }
  }

  io.to(roomNumber).emit(Events.ROLE_ASSIGN);

  ctx.body = {
    data: {},
    msg: "ok",
    status: 200,
  } as HttpRes;
};

export default gameRoleAssign;
