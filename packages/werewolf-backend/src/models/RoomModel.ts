import { Character, GameStatus } from "@werewolf/shared";
import {
  day,
  ID,
  index,
  PublicPlayerDef,
  RoomDef,
} from "@werewolf/shared/ModelDefs";
import { createError } from "../middleware/handleError";
import { Player } from "./PlayerModel";

export class Room implements RoomDef {
  roomNumber: string;
  creatorID: ID;
  players: Player[];
  password?: string;
  currentDay: day = -1; // 狼人杀人时会 ++
  needingCharacters: Character[];
  isFinished = false;
  gameStatus: GameStatus[] = [GameStatus.WOLF_KILL];
  get curStatus(): GameStatus {
    return this.gameStatus[this.gameStatus.length - 1];
  }
  toFinishPlayers = new Set<index>();
  timer: NodeJS.Timeout;
  clearSelfTimer: NodeJS.Timeout;
  /** 死亡结算后的下一个状态 */
  nextStateOfDieCheck: GameStatus;
  /** 当前正在进行死亡结算的玩家序号 */
  curDyingPlayer: Player;

  createdAt = new Date();

  private static roomMap: Record<string, Room> = {};

  constructor({
    creator,
    needingCharacters,
    password,
  }: {
    creator: Player;
    needingCharacters: Character[];
    password?: string;
  }) {
    if (!checkNeedingCharacters(needingCharacters))
      createError({ msg: "人数配比不合法", status: 401 });

    let tryTime = 20;
    while (tryTime--) {
      const roomNumber = Math.random().toString().slice(2, 8);
      const prevRoom = Room.roomMap[roomNumber];
      if (
        prevRoom &&
        Date.now() - prevRoom.createdAt.getTime() < 1000 * 3600 * 24
      ) {
        continue;
      } else {
        this.roomNumber = roomNumber;
        Room.roomMap[this.roomNumber] = this;
        break;
      }
    }
    if (tryTime <= 0) {
      createError({ msg: "创建错误, 请重试!", status: 500 });
    }
    this.creatorID = creator._id;
    this.players = [creator];
    this.needingCharacters = needingCharacters; // default index=1
    this.password = password;

    this.clearSelfTimer = setTimeout(
      () => Room.clearRoom(this.roomNumber),
      3600 * 1000 * 12,
    ); // 12h 后清除此房间
  }

  playerJoin(name: string, password?: string): Player {
    const nameReg = /^.{1,15}$/;
    if (!nameReg.test(name))
      return createError({ status: 401, msg: "昵称不合法" });
    if (this.password && this.password !== password) {
      return createError({ status: 401, msg: "密码错误" });
    }
    if (this.players.length === this.needingCharacters.length) {
      return createError({ status: 401, msg: "房间已满" });
    }

    const player = new Player({ name });

    this.players.push(player);

    return player;
  }

  choosePublicInfo(): PublicPlayerDef[] {
    return this.players
      .map((p) => p.getPublic(this))
      .sort((a, b) => a.index - b.index);
  }

  getPlayerById(id: string): Player {
    const player = this.players.find((p) => p._id === id);
    if (!player) return createError({ status: 401, msg: "id 错误" });
    return player;
  }
  getPlayerByIndex(index: index): Player {
    const player = this.players.find((p) => p.index === index);
    if (!player) return createError({ status: 401, msg: "编号错误" });
    return player;
  }

  isSeatAvailable(index: index): boolean {
    const player = this.players.find((p) => p.index === index);
    return !player;
  }

  reset() {
    this.currentDay = -1;
    this.isFinished = false;
    this.gameStatus = [GameStatus.WOLF_KILL];
    this.toFinishPlayers = new Set<index>();
    this.nextStateOfDieCheck = undefined;
    this.curDyingPlayer = undefined;

    for (let i = 0; i < this.players.length; i++) {
      this.players[i].reset();
    }
  }

  static getRoom(number: string): Room {
    const room = Room.roomMap[number];
    // // console.log("# RoomModel", { room });
    if (!room) return createError({ status: 400, msg: "未找到房间号" });
    return room;
  }

  static clearRoom(number: string): void {
    delete this.roomMap[number];
  }
}

function checkNeedingCharacters(needingCharacters: Character[]): boolean {
  if (!needingCharacters.length) return false;
  const charMap: Partial<Record<Character, number>> = needingCharacters.reduce(
    (map, character) => {
      map[character] = map[character] || 0;
      map[character]++;
      return map;
    },
    {},
  );

  if (!charMap.WEREWOLF) return false;

  if (charMap.WEREWOLF > needingCharacters.length / 2) return false;

  return true;
}
