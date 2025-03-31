import { HttpRes } from "./_httpResTemplate";
import { Character } from "../GameDefs";
import { ID, index } from "../ModelDefs";

export interface ChangeSeatRequest {
  index: number;
}

export type ChangeSeatResponse = HttpRes<{
  ID: ID,
  index: index,
  needingCharacters: Character[],
}>