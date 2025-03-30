import { ref, watch } from "vue";

export const backGroundAudio = ref<HTMLAudioElement | null>(null);

export const loadAudio = () => {
  if (!backGroundAudio.value) {
    backGroundAudio.value = new Audio("/audios/bg.mp3");
    backGroundAudio.value.load(); // Preload the audio file
  }
};
export const play = () => {
  if (backGroundAudio.value) {
    backGroundAudio.value.volume = 0.3;
    backGroundAudio.value.play();
  }
};
export const stopBGAudio = () => {
  if (backGroundAudio.value) {
    backGroundAudio.value.pause();
    backGroundAudio.value.currentTime = 0;
  }
};
