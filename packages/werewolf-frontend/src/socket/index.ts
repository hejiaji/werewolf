import io from "socket.io-client";

// handlers
import changeStatus from "./changeStatus";
import gameBegin from "./gameBegin";
import gameRestart from "./gameRestart";
import gameEnd from "./gameEnd";
import refreshPlayersInfo from "./refreshPlayersInfo";
import showWSMsg from "./showWSMsg";
import refreshGameStatus from "./refresh";
import { SERVER_DOMAIN, WS_PATH, Events } from "@werewolf/shared";
import { isReconnecting, flashReconnected } from "../reactivity/reconnecting";
import { getGameStatus } from "../http/gameStatus";
import { refresh } from "../reactivity/game";
import router from "../router";

let socket: SocketIOClient.Socket;
let currentRoom: string | null = null;

function registerHandlers() {
  socket.on(Events.CHANGE_STATUS, changeStatus);
  socket.on(Events.ROLE_ASSIGN, refreshGameStatus);
  socket.on(Events.GAME_BEGIN, gameBegin);
  socket.on(Events.GAME_END, gameEnd);
  socket.on(Events.ROOM_JOIN, refreshPlayersInfo);
  socket.on(Events.SEAT_CHANGE, refreshPlayersInfo);
  socket.on(Events.SHOW_MSG, showWSMsg);
  socket.on(Events.GAME_RESTART, gameRestart);

  // Show banner as soon as the connection is lost.
  socket.on("disconnect", () => {
    isReconnecting.value = true;
  });

  // Re-join the room after any reconnection so the server puts
  // this socket back into the correct Socket.IO room.
  // Note: for the manual connect() path the "connect" event below also fires,
  // so the redirect logic lives there to avoid duplication.
  socket.on("reconnect", () => {
    // "connect" fires immediately after "reconnect" in socket.io-client,
    // so isReconnecting and the redirect are handled there.
    // We keep this handler only as a safety net for older socket.io versions.
  });

  // Also clear the banner when a manual connect() succeeds.
  socket.on("connect", async () => {
    const wasReconnecting = isReconnecting.value;
    isReconnecting.value = false;

    if (currentRoom) {
      socket.emit(Events.ROOM_JOIN, currentRoom);
    }

    if (wasReconnecting) {
      // Only flash "reconnected" if we were previously disconnected,
      // not on the very first connection.
      flashReconnected();

      const currentRoute = router.currentRoute.value.name;

      if (currentRoute === "waitRoom") {
        // If the game started while we were offline, redirect to /play.
        const status = await getGameStatus({});
        if (status && status.curDay >= 0) {
          router.push({ name: "play" });
        }
      } else if (currentRoute === "play") {
        // Resync game state in case we missed a CHANGE_STATUS event while offline.
        await refresh();
      }
    }
  });
}

function joinRoom(roomNumber: string) {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  currentRoom = roomNumber;
  isReconnecting.value = false;

  socket = io(SERVER_DOMAIN, {
    path: WS_PATH,
  });

  registerHandlers();

  socket.emit(Events.ROOM_JOIN, roomNumber);
}

/**
 * When the user switches away from the tab and comes back, the WebSocket
 * connection may have been dropped by the OS or the browser. Detect this
 * via the Page Visibility API and force a reconnect so the user is
 * seamlessly put back into their room.
 */
function handleVisibilityChange() {
  if (document.visibilityState !== "visible") return;
  if (!socket || !currentRoom) return;

  if (!socket.connected) {
    // The socket was dropped while the tab was hidden – reconnect.
    isReconnecting.value = true;
    socket.connect();
  }
}

document.addEventListener("visibilitychange", handleVisibilityChange);

export { joinRoom, Events, socket };
