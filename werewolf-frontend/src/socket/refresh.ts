import { refresh } from "../reactivity/game";

export default async function refreshGameStatus() {
  console.log("#ws on refresh");

  await refresh();
}
