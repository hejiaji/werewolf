import { RefreshPlayerMsg } from "../../shared/WSMsg/RoomJoin";

import { players } from "../reactivity/game";

export default function refreshPlayersInfo(msg: RefreshPlayerMsg) {
  // console.log("#ws on room join");

  players.value = msg;
}
