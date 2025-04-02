import { players } from "../reactivity/game";
import { RefreshPlayerMsg } from "@werewolf/shared/src/WSMsg/RoomJoin";

export default function refreshPlayersInfo(msg: RefreshPlayerMsg) {
  // console.log("#ws on room join");

  players.value = msg;
}
