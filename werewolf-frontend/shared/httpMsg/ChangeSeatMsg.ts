import { HttpRes } from "./_httpResTemplate";

export interface ChangeSeatRequest {
  index: number;
}

export type ChangeSeatResponse = HttpRes<{
  ID: player._id,
  index: player.index,
  needingCharacters: room.needingCharacters,
}>