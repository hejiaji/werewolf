import { h } from "vue";

import { gameStatus, self } from "../../reactivity/game";
import { potion, shouldRestart } from "../../reactivity/playAction";
import ActionBtn from "./ActionBtn.vue";
import { getFirstNightResult, witchGetDieNShow } from "../../http/gameGetHint";
import { GameStatus } from "@werewolf/shared";

const actionInfoList: {
  content: string;
  isShown: () => boolean;
  disabled: () => boolean;
  noTarget?: boolean;
  onClick?: Function;
  hideActionButton?: boolean;
}[] = [
  // {
  //   content: "票选狼人",
  //   isShown: () => true,
  //   disabled: () => gameStatus.value !== GameStatus.EXILE_VOTE,
  // },
  // {
  //   content: "票选警长",
  //   isShown: () => true,
  //   disabled: () => gameStatus.value !== GameStatus.SHERIFF_VOTE,
  // },
  // {
  //   content: "参与警长竞选",
  //   isShown: () => true,
  //   disabled: () => gameStatus.value !== GameStatus.SHERIFF_ELECT,
  //   noTarget: true,
  // },
  {
    content: "昨夜信息",
    isShown: () =>
      self.value.isCreator === true &&
      gameStatus.value === GameStatus.SHERIFF_ELECT,
    disabled: () => false,
    hideActionButton: true,
    onClick: () => getFirstNightResult(),
  },
  {
    content: "杀人",
    isShown: () => self.value.character === "WEREWOLF",
    disabled: () => gameStatus.value !== GameStatus.WOLF_KILL,
  },
  {
    content: "查验身份",
    isShown: () => self.value.character === "SEER",
    disabled: () => gameStatus.value !== GameStatus.SEER_CHECK,
  },
  {
    content: "当晚死亡情况",
    isShown: () => self.value.character === "WITCH",
    disabled: () => gameStatus.value !== GameStatus.WITCH_ACT,
    hideActionButton: true,
    onClick: () => witchGetDieNShow(),
  },
  {
    content: "使用毒药",
    isShown: () => self.value.character === "WITCH",
    disabled: () => gameStatus.value !== GameStatus.WITCH_ACT,
    onClick: () => (potion.value = "POISON"),
  },
  {
    content: "使用解药",
    isShown: () => self.value.character === "WITCH",
    disabled: () => gameStatus.value !== GameStatus.WITCH_ACT,
    onClick: () => (potion.value = "MEDICINE"),
  },
  {
    content: "不用药",
    isShown: () => self.value.character === "WITCH",
    disabled: () => gameStatus.value !== GameStatus.WITCH_ACT,
    onClick: () => (potion.value = undefined),
    noTarget: true,
  },
  {
    content: "守护一名玩家",
    isShown: () => self.value.character === "GUARD",
    disabled: () => gameStatus.value !== GameStatus.GUARD_PROTECT,
  },
  // {
  //   content: "传递警徽",
  //   isShown: () => self.value.isSheriff,
  //   disabled: () => gameStatus.value !== GameStatus.SHERIFF_ASSIGN,
  // },
  // {
  //   content: "猎人开枪",
  //   isShown: () => self.value.character === "HUNTER",
  //   disabled: () => gameStatus.value !== GameStatus.HUNTER_SHOOT,
  // },
  {
    content: "挠挠痒",
    isShown: () => true,
    disabled: () => false,
  },
  {
    content: "重新游戏",
    isShown: () => self.value.isCreator === true,
    disabled: () => false,
    noTarget: true,
    onClick: () => {
      shouldRestart.value = true;
    },
  },
  // {
  //   content: "结束发言",
  //   isShown: () => true,
  //   disabled: () => {
  //     if (gameStatus.value === GameStatus.DAY_DISCUSS)
  //       return !self.value.isAlive;
  //     if (
  //       gameStatus.value === GameStatus.SHERIFF_SPEECH &&
  //       self.value.canBeVoted
  //     )
  //       return false;
  //
  //     if (gameStatus.value === GameStatus.LEAVE_MSG) {
  //       const dyingPlayer = players.value.find((p) => p.isDying);
  //       if (dyingPlayer && dyingPlayer.index === self.value.index)
  //         return false;
  //     }
  //
  //     return true;
  //   },
  //   noTarget: true,
  // },
];

export const renderActionList = () =>
  actionInfoList.map((obj) => {
    if (!obj.isShown()) return null;

    return h(ActionBtn, {
      disabled: obj.disabled() || !self.value.isAlive,
      content: obj.content,
      noTarget: obj.noTarget,
      onClick: obj.onClick,
      hideActionButton: !!obj.hideActionButton,
    });
  });
