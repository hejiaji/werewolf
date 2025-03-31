import { Middleware } from "koa";

import {
    JoinRoomRequest, JoinRoomResponse
} from "@werewolf/shared/httpMsg/JoinRoomMsg";
import { Events } from "@werewolf/shared";
import { RefreshPlayerMsg } from "@werewolf/shared/WSMsg/RoomJoin";
import io from "../../index";
import { Room } from "../../models/RoomModel";

const roomJoin: Middleware = async (ctx) => {
  const req = ctx.request.body as JoinRoomRequest;
  const { name, password, roomNumber } = req;

  const room = Room.getRoom(roomNumber);

  const player = room.playerJoin(name, password);

  const ret: JoinRoomResponse = {
    status: 200,
    msg: "ok",
    data: {
      ID: player._id,
      needingCharacters: room.needingCharacters,
    },
  };

  const roomJoinMsg: RefreshPlayerMsg = room.choosePublicInfo();

  io.to(roomNumber).emit(Events.ROOM_JOIN, roomJoinMsg);

  ctx.body = ret;
};

export default roomJoin;
