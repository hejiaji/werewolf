import { showDialog } from "../reactivity/dialog";
import request from "./_request";
import { lastNightResult } from "../reactivity/playAction";

/**
 * 获得狼人队友并显示弹窗
 * @returns 是否成功
 */
export async function getWolfsNShow(): Promise<boolean> {
  const res = await request<string>({
    url: "/game/hint/getWolfs",
    method: "GET",
  });

  if (!res || res.status !== 200) return false;

  showDialog(res.data);

  return true;
}

/**
 * 女巫获得狼人杀人结果并显示弹窗
 * @returns 是否成功
 */
export async function witchGetDieNShow(): Promise<boolean> {
  const res = await request<string>({
    url: "/game/hint/witchGetDie",
    method: "GET",
  });

  if (!res || res.status !== 200) return false;

  showDialog(res.data, 10);

  return true;
}

export async function getFirstNightResult(shouldShow = true): Promise<boolean> {
  if (!lastNightResult.value) {
    const res = await request<string>({
      url: "/game/hint/getFirstNightResult",
      method: "GET",
    });

    if (!res || res.status !== 200) return false;

    lastNightResult.value = res.data;
  }

  if (shouldShow) {
    showDialog(lastNightResult.value, 10);
  }

  return true;
}
