import { Middleware } from "koa";

import { Events } from "../../../../werewolf-frontend/shared/WSEvents";
import { RefreshPlayerMsg } from "../../../../werewolf-frontend/shared/WSMsg/RoomJoin";
import io from "../../index";
import { Room } from "../../models/RoomModel";
import { ChangeSeatRequest, ChangeSeatResponse } from "../../../../werewolf-frontend/shared/httpMsg/ChangeSeatMsg";
import { IDHeaderName, RoomNumberHeaderName } from "../../../../werewolf-frontend/shared/constants";
import { createError } from "../../middleware/handleError";

const roomSeatUpdate: Middleware = async (ctx) => {
  const req = ctx.request.body as ChangeSeatRequest;

  const playerID = ctx.get(IDHeaderName);
  const roomNumber = ctx.get(RoomNumberHeaderName);
  // console.log("# roomJoin", { roomNumber });
  const room = Room.getRoom(roomNumber);
  const curPlayer = room.getPlayerById(playerID);

  if (!room.isSeatAvailable(req.index)) {
    createError({
      status: 500,
      msg: "该座位已被抢 :)"
    })
  }

  curPlayer.index = req.index;

  const ret: ChangeSeatResponse = {
    status: 200,
    msg: "ok",
    data: {
      ID: curPlayer._id,
      index: curPlayer.index,
      needingCharacters: room.needingCharacters,
    },
  };

  const roomPlayerMsg: RefreshPlayerMsg = room.choosePublicInfo();

  io.to(roomNumber).emit(Events.SEAT_CHANGE, roomPlayerMsg);

  ctx.body = ret;
};

export default roomSeatUpdate;
