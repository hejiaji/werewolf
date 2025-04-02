<template>
  <div class="waitroom">
    <RoomPlayerList :playerList="playerList"></RoomPlayerList>
    <div class="room-number">房间号：{{ number }}</div>
    <div id="qr-code"></div>
    <Btn
      @click="gameBegin"
      v-if="self.isCreator"
      content="开始游戏"
      class="wait-btn"
      :disabled="!canBegin"
    ></Btn>
    <Btn
      @click="gameRoleAssign"
      v-if="self.isCreator"
      content="分配角色"
      class="wait-btn"
      :disabled="!canBegin"
    ></Btn>
    <Btn
      @click="showCharacter = true"
      content="查看角色"
      class="wait-btn"
      :disabled="!self.character"
    ></Btn>

    <Character></Character>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, computed } from "vue";

import RoomPlayerList from "../components/RoomPlayerList.vue";
import Btn from "../components/Btn.vue";
import { showDialog } from "../reactivity/dialog";
import {
  needingCharacters,
  refresh,
  self,
  players,
  character,
} from "../reactivity/game";
import { showCharacter } from "../reactivity/playPage";
import { gameBegin, initRoom, gameRoleAssign } from "../http/room";
import Character from "../components/PlayCharacter.vue";
import { loadAudio } from "../reactivity/audio";

const WaitRoom = defineComponent({
  name: "WaitRoom",
  components: { Character, RoomPlayerList, Btn },
  props: {
    pw: { type: String, required: false },
    number: { type: String, required: true },
  },
  setup(props) {
    const { pw, number } = toRefs(props);
    onMounted(async () => {
      loadAudio();
      const res = await initRoom({ roomNumber: number.value });
      if (res && res.status === 200) {
        players.value = res.data.players;
        needingCharacters.value = res.data.needingCharacters;
      }
      refresh();
    });

    const playerList = computed(() => {
      return new Array(needingCharacters.value.length).fill(0).map(
        (_, ind) =>
          players.value.find((player) => player.index === ind + 1) || {
            index: ind + 1,
          },
      );
    });

    const canBegin = computed(
      () => needingCharacters.value.length === players.value.length,
    );

    return {
      showDialog,
      playerList,
      self,
      gameBegin,
      canBegin,
      character,
      showCharacter,
      gameRoleAssign,
    };
  },
});

export default WaitRoom;
</script>

<style lang="scss" scoped>
.waitroom {
  #qr-code {
    margin: 5dvh auto;
    width: min-content;
  }
  .room-number {
    font-weight: bold;
    font-size: 1.6rem;
    text-align: center;
  }
  .btn {
    display: block;
    text-align: center;
    margin: 1rem;
  }
}
</style>
