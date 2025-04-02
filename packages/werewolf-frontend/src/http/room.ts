import request from "./_request";
import {
  CreateRoomRequest,
  CreateRoomResponse,
} from "@werewolf/shared/src/httpMsg/CreateRoomMsg";
import {
  JoinRoomRequest,
  JoinRoomResponse,
} from "@werewolf/shared/src/httpMsg/JoinRoomMsg";
import {
  InitRoomRequest,
  InitRoomResponse,
} from "@werewolf/shared/src/httpMsg/InitRoomMsg";
import {
  ChangeSeatRequest,
  ChangeSeatResponse,
} from "@werewolf/shared/src/httpMsg/ChangeSeatMsg";

export async function createRoom(
  data: CreateRoomRequest,
): Promise<CreateRoomResponse> {
  const res = (await request({
    url: "/room/create",
    method: "POST",
    data,
  })) as unknown;

  return res as CreateRoomResponse;
}

export async function joinRoom(
  data: JoinRoomRequest,
): Promise<JoinRoomResponse | null> {
  const res = (await request({
    url: "/room/join",
    method: "POST",
    data,
  })) as unknown;

  return res as JoinRoomResponse;
}

export async function initRoom(
  data: InitRoomRequest,
): Promise<InitRoomResponse | null> {
  const res = (await request({
    url: "/room/init",
    method: "POST",
    data,
  })) as unknown;

  return res as InitRoomResponse;
}

export async function changeSeat(
  data: ChangeSeatRequest,
): Promise<ChangeSeatResponse | null> {
  const res = (await request({
    url: "/room/seat",
    method: "POST",
    data,
  })) as unknown;

  return res as ChangeSeatResponse;
}

export async function gameRoleAssign(): Promise<boolean> {
  const res = await request({
    url: "/game/assignRole",
    method: "POST",
  });

  return res.status === 200;
}

export async function gameBegin(): Promise<boolean> {
  const res = await request({
    url: "/game/begin",
    method: "POST",
  });

  return res.status === 200;
}

export async function gameRestart(): Promise<boolean> {
  const res = await request({
    url: "/game/restart",
    method: "POST",
  });

  return res.status === 200;
}
