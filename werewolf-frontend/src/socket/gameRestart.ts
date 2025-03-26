import { showDialog } from "../reactivity/dialog";
import router from "../router";
import { roomNumber } from "../reactivity/joinRoom";

export default function gameRestart() {
  showDialog(
    `<b>重回大厅</b>`, 5
  );

  setTimeout(() => {
    router.replace({
      name: "waitRoom",
      query: {
        number: roomNumber.value,
      },
    });
  }, 1000);
}
