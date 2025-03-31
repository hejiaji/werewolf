import { GameStatus } from "../GameDefs";
import { day, PlayerDef, PublicPlayerDef } from "../ModelDefs";

export interface GameStatusRequest {}

export type GameStatusResponse = {
  players: PublicPlayerDef[];
  self: PlayerDef;
  curDay: day;
  gameStatus: GameStatus;
};
