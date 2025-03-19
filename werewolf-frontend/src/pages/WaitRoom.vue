<template>
  <div class="waitroom">
    <RoomPlayerList :playerList="playerList"></RoomPlayerList>
    <div class="room-number">房间号：{{ number }}</div>
    <div id="qr-code"></div>
    <Btn
      @click="gameBegin"
      v-if="self.index === 1"
      content="开始游戏"
      class="wait-btn"
      :disabled="!canBegin"
    ></Btn>
    <Btn
      class="wait-btn"
      @click="showDialog(
'天黑请闭眼' +
 '狼人请睁眼，狼人请杀人(狼人杀人时间)狼人请闭眼。\n'+
 '女巫请睁眼，女巫今天晚上他死了，女巫你有一瓶解药要用吗？女巫你有一瓶毒药要用吗？(只能用一瓶)\n'+
 '预言家请睁眼，预言家请验人，预言家你验的人的身份是（？），预言家请闭眼\n'+
 '守卫请睁眼，守卫请守护：\n'+
 '猎人请睁眼，猎人你的技能状态是:\n'+
 '\n'+
'天亮了，大家请睁眼\n', 60)"
      content="查看规则"
    ></Btn>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    toRefs,
    onMounted,
    computed,
  } from "vue";
  import QRCode from "easyqrcodejs";

  import { CLIENT_BASE_URL } from "../../shared/constants";
  import RoomPlayerList from "../components/RoomPlayerList.vue";
  import Btn from "../components/Btn.vue";
  import { showDialog } from "../reactivity/dialog";
  import {
    needingCharacters,
    refresh,
    self,
    players,
  } from "../reactivity/game";
  import { gameBegin, initRoom } from "../http/room";

  const WaitRoom = defineComponent({
    name: "WaitRoom",
    components: { RoomPlayerList, Btn },
    props: {
      pw: { type: String, required: false },
      number: { type: String, required: true },
    },
    setup(props) {
      const { pw, number } = toRefs(props);
      onMounted(async () => {
        new QRCode(document.getElementById("qr-code"), {
          text: `${CLIENT_BASE_URL}/joinRoom?pw=${
            pw && pw.value
          }&number=${number && number.value}`,
          logo: "/wolf.png",
          logoWidth: 20,
          logoHeight: 20,
          width: 100,
          height: 100,
        });
        const res = await initRoom({ roomNumber: number.value });
        if (res && res.status === 200) {
          players.value = res.data.players;
          needingCharacters.value = res.data.needingCharacters;
        }
        refresh();
      });

      const playerList = computed(() => {
        return new Array(needingCharacters.value.length)
          .fill(0)
          .map(
            (_, ind) =>
              players.value.find(
                (player) => player.index === ind + 1
              ) || {
                index: ind + 1,
              }
          );
      });

      const canBegin = computed(
        () =>
          needingCharacters.value.length === players.value.length
      );

      return { showDialog, playerList, self, gameBegin, canBegin };
    },
  });

  export default WaitRoom;
</script>

<style lang="scss" scoped>
  .waitroom {
    #qr-code {
      margin: 5vh auto;
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
