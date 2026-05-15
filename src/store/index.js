import { defineStore } from "pinia";

export const mainStore = defineStore("audio", {
  state: () => ({
    ready: false,
    isPlaying: false,
    volume: 0.72,
    currentIndex: 0,
    currentTrack: {
      name: null,
      artist: null,
      cover: "",
    },
    lyric: "等待播放",
    playlist: [],
    currentTime: 0,
    duration: 0,
    loadedTime: 0,
    autoplay: false,
    loop: "all",
    order: "list",
  }),
  actions: {
    setReady(value) {
      this.ready = value;
    },
    setPlayback(value) {
      this.isPlaying = value;
    },
    setTrack(track, index = this.currentIndex) {
      if (Number.isFinite(index)) {
        this.currentIndex = index;
      }
      this.currentTrack = {
        name: track?.name || null,
        artist: track?.artist || null,
        cover: track?.cover || "",
      };
    },
    setPlaylist(value) {
      this.playlist = Array.isArray(value) ? value : [];
    },
    setCurrentIndex(value) {
      if (Number.isFinite(value)) {
        this.currentIndex = value;
      }
    },
    setLyric(value) {
      this.lyric = value;
    },
    setVolume(value) {
      const nextVolume = Number(value);
      if (Number.isFinite(nextVolume)) {
        this.volume = Math.min(Math.max(nextVolume, 0), 1);
      }
    },
    setTimeline(payload = {}) {
      if (Number.isFinite(payload.currentTime)) {
        this.currentTime = payload.currentTime;
      }
      if (Number.isFinite(payload.duration)) {
        this.duration = payload.duration;
      }
      if (Number.isFinite(payload.loadedTime)) {
        this.loadedTime = payload.loadedTime;
      }
    },
    resetTimeline() {
      this.currentTime = 0;
      this.duration = 0;
      this.loadedTime = 0;
    },
  },
  persist: {
    key: "audio-preferences",
    storage: window.localStorage,
    paths: ["volume", "autoplay", "loop", "order"],
  },
});
