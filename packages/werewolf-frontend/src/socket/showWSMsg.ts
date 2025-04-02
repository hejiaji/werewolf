import { showDialog } from "../reactivity/dialog";
import { ShowMsg } from "@werewolf/shared/src/WSMsg/ShowMsg";

export default function showWSMsg(msg: ShowMsg) {
  showDialog(msg.innerHTML, msg.showTime);
}
