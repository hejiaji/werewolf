<template>
  <div class="createroom">
    <span class="title">角色设置</span>
    <div class="tile-wrapper">
      <room-character-tile
        :key="value"
        v-for="(_, value) in characters"
        :character="value"
      ></room-character-tile>
    </div>
    <div class="name">
      <span class="hint">你的昵称：</span>
      <use-border>
        <input
          :maxlength="10"
          type="text"
          placeholder="请输入昵称"
          v-model="nickname"
        />
      </use-border>
    </div>
    <div class="password">
      <span class="hint">房间密码：</span>
      <use-border>
        <input
          type="text"
          :maxlength="20"
          placeholder="(可选)"
          v-model="password"
        />
      </use-border>
    </div>
    <outlined-btn
      @click="create()"
      content="确认创建"
    ></outlined-btn>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import RoomCharacterTile from "../components/RoomCharacterTile.vue";
  import OutlinedBtn from "../components/Btn.vue";
  import UseBorder from "../components/UseBorder.vue";

  import {
    characters,
    nickname,
    password,
    create,
  } from "../reactivity/createRoom";
  import { showDialog } from "../reactivity/dialog";

  const CreateRoom = defineComponent({
    name: "CreateRoom",
    components: { RoomCharacterTile, OutlinedBtn, UseBorder },
    setup(props) {
      return {
        characters,
        nickname,
        password,
        create,
        showDialog,
      };
    },
  });

  export default CreateRoom;
</script>

<style lang="scss" scoped>
  .createroom {
    padding: 1rem 1rem 0;
    text-align: center;
    .title {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .tile-wrapper {
      display: flex;
      flex-wrap: wrap;
      .room-character-tile {
        flex: 0 0 33%;
        padding: 1rem 0;
      }
    }

    .name,
    .password {
      .hint {
        position: relative;
        bottom: 0.04em;
        word-break: keep-all;
        margin-right: 0.5rem;
        font-weight: bold;
      }
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2rem 0;
      input {
        max-width: calc(100% - 1rem);
        padding: 0 0.5rem;
        line-height: 2.4rem;
        overflow: visible;
      }
      .useborder {
        max-width: 50%;
      }
    }

    .btn {
      margin: auto;
    }
  }
</style>
