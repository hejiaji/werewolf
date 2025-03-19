import { RoomDef } from "./ModelDefs";

export type SetableCharacters =
  | "HUNTER"
  | "WITCH"
  | "SEER"
  | "GUARD"
  | "VILLAGER"
  | "WEREWOLF"
  | "Idiot";

export type Character =
  | SetableCharacters
  | "SHERIFF"
  // | "HOST"
  | "";

export type Potion = "POISON" | "MEDICINE";

export const ChineseNames: Record<Character, string> = {
  HUNTER: "猎人",
  GUARD: "守卫",
  // HOST: "主持人",
  SEER: "预言家",
  SHERIFF: "警长",
  VILLAGER: "村民",
  WEREWOLF: "狼人",
  WITCH: "女巫",
  Idiot: "白痴",
  "": "",
};

export const CharacterIntro: Record<Character, string> = {
  HUNTER:
    "你在死亡后可以选择开枪杀死任意一名玩家，但若是被女巫毒死则无法使用此技能。每晚你会醒来查看自己的开枪状态。",
  GUARD:
    "你每晚可以保护一名角色（包括自己）不被狼人伤害，但不能连续两天守护同一个人。若你守护的人同时被女巫施用了灵药，他还是会死亡。",
  // HOST: "主持人",
  SEER: "每晚可以查验一名角色是否为狼人。",
  SHERIFF:
    "在白天的放逐投票中，你选择的人将获得 1.5 票。在你死后，可以选择指派任意玩家继任警长，也可以销毁警徽（如果这么做，村庄将再也不会有警长了）。",
  VILLAGER:
    "你是一名普通村民，没有特殊能力，但可以发挥你的推理，找出狼人！",
  WEREWOLF:
    "你是一个狼人，每晚你将和同伴一起苏醒，投票选择一名玩家将其杀害。你的目标是杀死所有非狼人角色！",
  WITCH:
    "你有两瓶药。第一瓶是灵药，当你未使用过它时，每晚你都将察觉到谁被狼人杀害了，你可以使用灵药来救活他；第二瓶是毒药，你可以使用它杀死任意一名玩家。游戏中，灵药毒药各只能使用一次。每晚你最多只能使用一瓶药。只有第一晚你可以使用灵药救自己。",
  Idiot:
    "你在白天被投票出局可翻盘免除死亡，但从此不再拥有投票权。",
  "": "",
};

/**
 * 当前是什么游戏阶段
 * // TODO 每个状态需要一个 http 请求来结束
 */
export enum GameStatus {
  // TODO 添加游戏开始前和游戏已经结束的状态
  WOLF_KILL = "狼人杀人",

  SEER_CHECK = "预言家验人",

  WITCH_ACT = "女巫用药",

  GUARD_PROTECT = "守卫保人",

  SHERIFF_ELECT = "上警",

  SHERIFF_VOTE = "投票选警长",
  SHERIFF_SPEECH = "警长竞选发言",
  SHERIFF_VOTE_CHECK = "查看警长投票结果",

  /**
   * 指当前警长去世了, 指定新的警长
   */
  SHERIFF_ASSIGN = "指派警长",
  SHERIFF_ASSIGN_CHECK = "检查指派警长的结果",

  BEFORE_DAY_DISCUSS = "夜晚结算",

  DAY_DISCUSS = "自由发言",

  EXILE_VOTE = "票选狼人",
  EXILE_VOTE_CHECK = "票选狼人结果",

  HUNTER_SHOOT = "若你是猎人, 请选择是否开枪",
  HUNTER_CHECK = "查看猎人开枪结果",

  LEAVE_MSG = "留遗言",
}

/** 可以允许玩家进行操作的状态 */
export type StatusWithAction =
  | GameStatus.WOLF_KILL
  | GameStatus.SEER_CHECK
  | GameStatus.WITCH_ACT
  | GameStatus.GUARD_PROTECT
  | GameStatus.SHERIFF_ELECT
  | GameStatus.SHERIFF_VOTE
  | GameStatus.SHERIFF_ASSIGN
  | GameStatus.DAY_DISCUSS
  | GameStatus.EXILE_VOTE
  | GameStatus.HUNTER_SHOOT
  | GameStatus.SHERIFF_SPEECH
  | GameStatus.LEAVE_MSG;

/** 预设的每个阶段的时间限制(s) */
export const TIMEOUT: Record<GameStatus, number> = {
  [GameStatus.WOLF_KILL]: 777,
  [GameStatus.SEER_CHECK]: 777,
  [GameStatus.WITCH_ACT]: 777,
  [GameStatus.GUARD_PROTECT]: 777,
  [GameStatus.HUNTER_CHECK]: 777,
  [GameStatus.SHERIFF_ELECT]: 777,
  [GameStatus.SHERIFF_VOTE]: 777,
  [GameStatus.SHERIFF_VOTE_CHECK]: 777,
  [GameStatus.SHERIFF_ASSIGN]: 777,
  [GameStatus.DAY_DISCUSS]: 777,
  [GameStatus.EXILE_VOTE]: 777,
  [GameStatus.EXILE_VOTE_CHECK]: 777,
  [GameStatus.HUNTER_SHOOT]: 777,
  [GameStatus.LEAVE_MSG]: 777,
  [GameStatus.BEFORE_DAY_DISCUSS]: 777,
  [GameStatus.SHERIFF_SPEECH]: 777,
  [GameStatus.SHERIFF_ASSIGN_CHECK]: 777,
};
