import request from "./_request";
import CharacterAct from "@werewolf/shared/src/httpMsg/CharacterAct";
import { HttpRes } from "@werewolf/shared/src/httpMsg/_httpResTemplate";
import { SeerCheckData } from "@werewolf/shared/src/httpMsg/SeerCheckMsg";

export async function characterAct(
  data: CharacterAct,
): Promise<HttpRes<Partial<SeerCheckData>>> {
  const res = await request({
    url: "/game/act",
    method: "POST",
    data,
  });

  return res;
}
