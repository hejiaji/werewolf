import { Ref, ref, watch } from "vue";

export enum AUDIO_CATEGORY {
  ENDING = "ending",
  GUARD = "guard",
  HUNTER = "hunter",
  SEER = "seer",
  WIZARD = "wizard",
  WOLF = "wolf",
  BG = "bg",
}

export const AUDIO_LIST: AUDIO_CATEGORY[] = [
  AUDIO_CATEGORY.HUNTER,
  AUDIO_CATEGORY.ENDING,
  AUDIO_CATEGORY.GUARD,
  AUDIO_CATEGORY.SEER,
  AUDIO_CATEGORY.WIZARD,
  AUDIO_CATEGORY.WOLF,
];

export const backGroundAudio = ref<HTMLAudioElement | null>(null);
export const guardAudio = ref<HTMLAudioElement | null>(null);
export const hunterAudio = ref<HTMLAudioElement | null>(null);
export const seerAudio = ref<HTMLAudioElement | null>(null);
export const wizardAudio = ref<HTMLAudioElement | null>(null);
export const wolfAudio = ref<HTMLAudioElement | null>(null);
export const endAudio = ref<HTMLAudioElement | null>(null);

const audio_map = {
  [AUDIO_CATEGORY.ENDING]: endAudio,
  [AUDIO_CATEGORY.GUARD]: guardAudio,
  [AUDIO_CATEGORY.HUNTER]: hunterAudio,
  [AUDIO_CATEGORY.SEER]: seerAudio,
  [AUDIO_CATEGORY.WIZARD]: wizardAudio,
  [AUDIO_CATEGORY.WOLF]: wolfAudio,
  [AUDIO_CATEGORY.BG]: backGroundAudio,
};

export const loadAudio = () => {
  if (!backGroundAudio.value) {
    backGroundAudio.value = new Audio("./audios/bg.mp3");
    backGroundAudio.value.load(); // Preload the audio file
  }

  for (let i = 0; i < AUDIO_LIST.length; i++) {
    const audioCategory = AUDIO_LIST[i];
    const audioElement = audio_map[
      audioCategory
    ] as Ref<HTMLAudioElement | null>;
    if (!audioElement.value) {
      audioElement.value = new Audio(`./audios/${audioCategory}.mp3`);
      audioElement.value.load();
    }
  }
};

const onAudioEndingEnded = () => {
  for (let i = 0; i < AUDIO_LIST.length; i++) {
    const audioCategory = AUDIO_LIST[i];
    const audioElement = audio_map[
      audioCategory
    ] as Ref<HTMLAudioElement | null>;
    if (audioElement.value) {
      audioElement.value.pause();
      audioElement.value.currentTime = 0;
    }
  }
};

export const playAudio = (category: AUDIO_CATEGORY) => {
  const audioElement = audio_map[category] as Ref<HTMLAudioElement | null>;
  if (audioElement.value) {
    if (category === AUDIO_CATEGORY.BG) {
      audioElement.value.play();
    } else {
      if (category === AUDIO_CATEGORY.ENDING) {
        audioElement.value.addEventListener("ended", onAudioEndingEnded);
      }
      setTimeout(() => {
        audioElement.value && audioElement.value.play();
      }, 4000);
    }
  }
};

export const stopBGAudio = () => {
  setTimeout(() => {
    if (backGroundAudio.value) {
      backGroundAudio.value.pause();
      backGroundAudio.value.currentTime = 0;
    }
  }, 3000);
};
