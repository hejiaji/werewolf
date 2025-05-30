<template>
  <div class="play">
    <PlayerList :playerList="players"></PlayerList>

    <div class="date">
      Day {{ Math.ceil(date / 2) }}
      <img
        class="date-icon"
        :src="`./assets/${date % 2 === 0 ? 'moon' : 'sun'}${theme}.svg`"
      />
    </div>

    <div class="game-status">{{ gameStatus }}</div>
    <div class="game-status">
      {{ gameStatusTimeLeft < 0 ? "请开始你的表演" : "剩余时间:" }}
      {{ gameStatusTimeLeft < 0 ? "" : gameStatusTimeLeft + "S" }}
    </div>

    <div class="actions">
      <Btn
        :disabled="isActing"
        @click="showCharacter = true"
        content="查看角色"
      ></Btn>
      <Btn
        :disabled="isActing"
        @click="showActions = true"
        :class="{ active: canAct }"
        content="技能操作"
      ></Btn>
      <!--      <Btn-->
      <!--        :disabled="isActing"-->
      <!--        @click="showMemo = true"-->
      <!--        content="备忘速记"-->
      <!--      ></Btn>-->
      <Btn
        :disabled="isActing"
        @click="showEvents = true"
        content="事件记录"
      ></Btn>

      <Character></Character>
      <Actions></Actions>
      <Memo></Memo>
      <Events></Events>
    </div>

    <BottomActions></BottomActions>
  </div>
</template>

<script lang="ts">
import { defineComponent, onActivated, onMounted, onUnmounted } from "vue";

import PlayerList from "../components/RoomPlayerList.vue";
import Btn from "../components/Btn.vue";
import Events from "../components/PlayEvents.vue";
import Memo from "../components/PlayMemo.vue";
import Character from "../components/PlayCharacter.vue";
import Actions from "../components/PlayActions/index.vue";
import BottomActions from "../components/PlayBottomActions.vue";

import {
  self,
  character,
  refresh,
  players,
  gameStatus,
  date,
  gameStatusTimeLeft,
} from "../reactivity/game";
import {
  showMemo,
  showActions,
  showCharacter,
  showEvents,
  canAct,
} from "../reactivity/playPage";
import { theme } from "../reactivity/theme";
import { isActing } from "../reactivity/playAction";
import { joinRoom } from "../socket";
import { getToken } from "../utils/token";
import { showDialog } from "../reactivity/dialog";
import router from "../router";
import { roomNumber } from "../reactivity/joinRoom";
import { AUDIO_CATEGORY, playAudio } from "../reactivity/audio";

const Play = defineComponent({
  name: "Play",
  components: {
    Btn,
    PlayerList,
    Memo,
    Character,
    Actions,
    Events,
    BottomActions,
  },
  setup(props) {
    onMounted(() => {
      const token = getToken();
      if (token === null) {
        showDialog("未加入房间或房间已过期!");
        router.replace({ name: "home" });
      } else {
        roomNumber.value = token.roomNumber;
        joinRoom(token.roomNumber);
        refresh();
      }
      if (self.value.isCreator) {
        playAudio(AUDIO_CATEGORY.BG);
      }
    });
    onActivated(refresh);

    // 设定剩余时间每秒减一
    let timer: NodeJS.Timeout;
    let refreshTimer: NodeJS.Timeout;
    onMounted(() => {
      timer = setInterval(() => (gameStatusTimeLeft.value -= 1), 1000);
      if (self.value.isCreator) {
        refreshTimer = setInterval(() => {
          refresh();
        }, 1000 * 600);
      }
    });
    onUnmounted(() => {
      clearInterval(timer);
      clearInterval(refreshTimer);
    });

    return {
      players,

      self,
      character,

      showMemo,
      showActions,
      canAct,
      showCharacter,
      showEvents,
      isActing,

      gameStatus,
      date,
      theme,
      gameStatusTimeLeft,
    };
  },
});

export default Play;
</script>

<style lang="scss" scoped>
.play {
  text-align: center;
  .actions {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .btn {
      margin: 0.5rem;
    }
  }
  .date,
  .game-status {
    font-weight: bold;
    font-size: 1.5rem;
    padding-bottom: 1.3rem;
  }
  .date {
    display: flex;
    align-items: center;
    justify-content: center;
    .date-icon {
      width: 2.6rem;
      margin: 0 1rem;
    }
  }
}
</style>

<style lang="scss">
.play {
  @keyframes blink {
    from {
      background-color: var(--bg);
    }
    to {
      background-color: var(--on-bg);
    }
  }
  .btn {
    position: relative;
    &.active::after {
      opacity: 1;
    }
    &::after {
      transition: all 0.2s;
      opacity: 0;
      $size: 0.6rem;
      content: "";
      position: absolute;
      right: -0.3 * $size;
      top: -0.3 * $size;
      width: $size;
      height: $size;
      background-color: var(--on-bg);
      border: 2px solid var(--bg);
      border-radius: 50%;
      animation: blink 1s linear infinite alternate;
    }
  }
}
</style>
