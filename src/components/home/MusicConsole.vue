<template>
  <section class="audio-panel" :class="{ 'matched-height': isExpandedAligned }" :style="panelStyle">
    <div class="panel-head">
      <div class="panel-title">
        <span class="panel-kicker">Music</span>
        <h2>最近在听</h2>
        <p class="panel-summary">保留几首最近常听的歌。</p>
      </div>

      <button class="queue-toggle" :class="{ active: playlistOpen }" type="button" @click="togglePlaylist">
        <span>{{ playlistOpen ? "收起歌单" : "查看歌单" }}</span>
        <span class="queue-count">{{ playlist.length }}</span>
      </button>
    </div>

    <div class="player-stage">
      <div class="stage-noise" aria-hidden="true" />

      <div class="stage-main">
        <div class="cover-stack">
          <div class="cover-halo" aria-hidden="true" />
          <img
            v-if="audio.currentTrack.cover"
            class="cover-art"
            :src="audio.currentTrack.cover"
            :alt="trackTitle"
          />
          <div v-else class="cover-placeholder">
            <PlayOne theme="filled" size="34" fill="currentColor" />
          </div>
        </div>

        <div class="stage-copy">
          <div class="track-topline">
            <span class="stage-label">Now playing</span>
            <span class="status-pill" :class="{ live: audio.isPlaying }">
              <span class="status-dot" />
              {{ audio.isPlaying ? "Playing" : "Standby" }}
            </span>
          </div>

          <h3>{{ trackTitle }}</h3>
          <p class="track-artist">{{ trackArtist }}</p>
          <p class="track-lyric">{{ audio.lyric || "等待播放" }}</p>

          <div class="timeline-shell">
            <div class="timeline-meta">
              <span>Playback</span>
              <span>{{ currentTimeText }} / {{ durationText }}</span>
            </div>

            <div class="timeline-track">
              <div class="timeline-loaded" :style="{ width: `${loadedPercent}%` }" />
              <div class="timeline-played" :style="{ width: `${playedPercent}%` }" />
              <input
                class="timeline-input"
                :value="playedPercent"
                type="range"
                min="0"
                max="100"
                step="0.1"
                @input="handleSeek"
              />
            </div>
          </div>

          <div class="control-strip">
            <div class="transport-cluster">
              <button class="transport-button" type="button" aria-label="上一首" @click="changeSong(0)">
                <GoStart theme="filled" size="20" fill="currentColor" />
              </button>

              <button class="play-button" type="button" aria-label="播放切换" @click="togglePlayback">
                <Pause v-if="audio.isPlaying" theme="filled" size="24" fill="currentColor" />
                <PlayOne v-else theme="filled" size="24" fill="currentColor" />
              </button>

              <button class="transport-button" type="button" aria-label="下一首" @click="changeSong(1)">
                <GoEnd theme="filled" size="20" fill="currentColor" />
              </button>
            </div>

            <label class="volume-cluster">
              <span class="volume-icon">
                <VolumeMute
                  v-if="Number(volumeValue) === 0"
                  theme="filled"
                  size="18"
                  fill="currentColor"
                />
                <VolumeSmall
                  v-else-if="Number(volumeValue) < 0.65"
                  theme="filled"
                  size="18"
                  fill="currentColor"
                />
                <VolumeNotice v-else theme="filled" size="18" fill="currentColor" />
              </span>

              <div class="volume-track">
                <div class="volume-track-fill" :style="{ width: `${volumePercent}%` }" />
                <input v-model="volumeValue" type="range" min="0" max="1" step="0.01" />
              </div>

              <span class="volume-value">{{ Math.round(Number(volumeValue) * 100) }}%</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <transition name="queue">
      <div v-show="playlistOpen" class="queue-panel">
        <div class="queue-head">
          <span class="queue-label">Queue</span>
          <span class="queue-meta">{{ playlist.length }} 首</span>
        </div>

        <ul v-if="playlist.length" class="queue-list">
          <li
            v-for="(track, index) in playlist"
            :key="`${track.name}-${track.artist}-${index}`"
            class="queue-item"
            :class="{ active: audio.currentIndex === index }"
            @click="playTrack(index)"
          >
            <span class="queue-index">{{ String(index + 1).padStart(2, "0") }}</span>

            <div class="queue-copy">
              <strong>{{ track.name }}</strong>
              <span>{{ track.artist || "Unknown Artist" }}</span>
            </div>

            <span class="queue-state" :class="{ live: audio.currentIndex === index && audio.isPlaying }">
              <template v-if="audio.currentIndex === index && audio.isPlaying">
                <span class="eq-bar" />
                <span class="eq-bar" />
                <span class="eq-bar" />
              </template>
              <template v-else-if="audio.currentIndex === index">Ready</template>
              <template v-else>Play</template>
            </span>
          </li>
        </ul>

        <div v-else class="queue-empty">歌单装载中</div>
      </div>
    </transition>

    <div class="engine-player" aria-hidden="true">
      <Player
        ref="playerRef"
        :song-server="playerData.server"
        :song-type="playerData.type"
        :song-id="playerData.id"
        :volume="audio.volume"
        :list-folded="true"
        :list-max-height="260"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import {
  GoEnd,
  GoStart,
  Pause,
  PlayOne,
  VolumeMute,
  VolumeNotice,
  VolumeSmall,
} from "@icon-park/vue-next";
import Player from "@/components/Player.vue";
import { mainStore } from "@/store";

const props = defineProps({
  panelHeight: {
    type: Number,
    default: null,
  },
});

const audio = mainStore();
const playerRef = ref(null);
const playlistOpen = ref(false);
const volumeValue = ref(audio.volume);

const playerData = {
  server: import.meta.env.VITE_SONG_SERVER,
  type: import.meta.env.VITE_SONG_TYPE,
  id: import.meta.env.VITE_SONG_ID,
};

const playlist = computed(() => audio.playlist || []);
const trackTitle = computed(() => audio.currentTrack.name || "等待曲目");
const trackArtist = computed(() => audio.currentTrack.artist || "等待播放");
const hasMatchedHeight = computed(() => Number.isFinite(props.panelHeight) && props.panelHeight > 0);
const isExpandedAligned = computed(() => playlistOpen.value && hasMatchedHeight.value);
const panelStyle = computed(() => {
  const styles = {};

  if (audio.currentTrack.cover) {
    styles["--audio-cover"] = `url("${audio.currentTrack.cover}")`;
  }

  if (isExpandedAligned.value) {
    styles["--panel-height"] = `${props.panelHeight}px`;
  }

  return styles;
});
const playedPercent = computed(() => {
  if (!audio.duration) return 0;
  return Math.min((audio.currentTime / audio.duration) * 100, 100);
});
const loadedPercent = computed(() => {
  if (!audio.duration) return 0;
  return Math.min((audio.loadedTime / audio.duration) * 100, 100);
});
const volumePercent = computed(() => Math.min(Number(volumeValue.value) * 100, 100));

const formatTime = (value) => {
  if (!Number.isFinite(value) || value <= 0) return "00:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const currentTimeText = computed(() => formatTime(audio.currentTime));
const durationText = computed(() => formatTime(audio.duration));

const togglePlayback = () => {
  playerRef.value?.playToggle();
};

const changeSong = (direction) => {
  playerRef.value?.changeSong(direction);
};

const playTrack = (index) => {
  playerRef.value?.playTrack(index);
};

const togglePlaylist = () => {
  playlistOpen.value = !playlistOpen.value;
};

const handleSeek = (event) => {
  if (!audio.duration) return;
  const percent = Number(event.target.value) / 100;
  playerRef.value?.seekTo(percent * audio.duration);
};

watch(volumeValue, (value) => {
  const nextVolume = Number(value);
  audio.setVolume(nextVolume);
  playerRef.value?.changeVolume(nextVolume);
});

watch(
  () => audio.volume,
  (value) => {
    if (Number(volumeValue.value) !== value) {
      volumeValue.value = value;
    }
  },
);
</script>

<style lang="scss" scoped>
.audio-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: visible;
  height: var(--panel-height, auto);
  min-height: 0;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.06), rgb(255 255 255 / 0.018)),
    rgb(8 13 22 / 0.78);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.05),
    0 24px 60px rgb(0 0 0 / 0.26);
  backdrop-filter: blur(20px);
}

.audio-panel::before,
.audio-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.audio-panel::before {
  background-image: var(--audio-cover);
  background-size: cover;
  background-position: center;
  filter: blur(82px) saturate(1.14);
  opacity: 0.18;
  transform: scale(1.2);
  mask-image: radial-gradient(circle at 20% 28%, rgb(0 0 0 / 0.94), transparent 58%);
}

.audio-panel::after {
  background:
    radial-gradient(circle at 78% 18%, rgb(255 255 255 / 0.05), transparent 24%),
    radial-gradient(circle at 16% 84%, rgb(102 231 216 / 0.06), transparent 28%);
}

.panel-head,
.player-stage,
.queue-panel,
.engine-player {
  position: relative;
  z-index: 1;
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.panel-kicker {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  color: var(--accent-cyan);
  text-transform: uppercase;
}

.panel-title h2 {
  margin: 0;
  font-size: 2rem;
  line-height: 1;
}

.panel-summary {
  margin-top: 12px;
  color: var(--text-soft);
  line-height: 1.6;
}

.queue-toggle {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.12);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.06), rgb(255 255 255 / 0.02)),
    rgb(255 255 255 / 0.03);
  color: var(--text-soft);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.04);
  transition:
    border-color 0.22s ease,
    color 0.22s ease,
    transform 0.22s ease,
    background-color 0.22s ease;
}

.queue-toggle.active {
  border-color: rgb(255 255 255 / 0.18);
  color: var(--text-main);
}

.queue-count {
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08);
  color: var(--text-main);
  font-size: 0.86rem;
}

.player-stage {
  margin-top: 18px;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background:
    linear-gradient(135deg, rgb(255 255 255 / 0.05), rgb(255 255 255 / 0.02)),
    rgb(12 18 28 / 0.56);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.06),
    0 18px 36px rgb(0 0 0 / 0.16);
}

.stage-noise {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgb(255 255 255 / 0.04), transparent 30%),
    radial-gradient(circle at 70% 35%, rgb(102 231 216 / 0.08), transparent 26%);
  pointer-events: none;
}

.stage-main {
  position: relative;
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr);
  gap: 22px;
  align-items: center;
}

.cover-stack {
  position: relative;
  width: 148px;
  height: 148px;
}

.cover-halo {
  position: absolute;
  inset: -12px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 30% 20%, rgb(255 255 255 / 0.14), transparent 24%),
    radial-gradient(circle at 50% 60%, rgb(102 231 216 / 0.2), transparent 44%);
  filter: blur(22px);
}

.cover-art,
.cover-placeholder {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  border: 1px solid rgb(255 255 255 / 0.12);
  box-shadow:
    0 20px 48px rgb(0 0 0 / 0.28),
    inset 0 1px 0 rgb(255 255 255 / 0.08);
}

.cover-art {
  object-fit: cover;
}

.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
  background:
    radial-gradient(circle at 30% 20%, rgb(255 255 255 / 0.16), transparent 18%),
    linear-gradient(135deg, rgb(102 231 216 / 0.18), rgb(255 255 255 / 0.04)),
    rgb(14 20 30 / 0.94);
}

.stage-copy {
  min-width: 0;
}

.track-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}

.stage-label {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-cyan);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.05);
  color: var(--text-soft);
  font-size: 0.76rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.status-pill.live {
  color: var(--text-main);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.3);
  box-shadow: 0 0 0 4px rgb(255 255 255 / 0.06);
}

.status-pill.live .status-dot {
  background: var(--accent-cyan);
  box-shadow: 0 0 0 4px rgb(102 231 216 / 0.14);
}

.stage-copy h3 {
  margin: 0;
  font-size: clamp(1.9rem, 3vw, 2.8rem);
  line-height: 0.98;
  word-break: break-word;
}

.track-artist {
  margin-top: 8px;
  color: rgb(220 233 255 / 0.74);
  font-size: 1.02rem;
}

.track-lyric {
  margin-top: 10px;
  min-height: 2.9em;
  color: var(--text-soft);
  line-height: 1.5;
  font-size: 0.94rem;
}

.timeline-shell {
  margin-top: 20px;
}

.timeline-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  color: var(--text-soft);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.timeline-track {
  position: relative;
  height: 16px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.06);
  box-shadow:
    inset 0 1px 1px rgb(255 255 255 / 0.05),
    inset 0 -1px 0 rgb(0 0 0 / 0.18);
  overflow: visible;
}

.timeline-loaded,
.timeline-played {
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  border-radius: 999px;
}

.timeline-loaded {
  background: linear-gradient(90deg, rgb(255 255 255 / 0.2), rgb(255 255 255 / 0.05));
}

.timeline-played {
  background: linear-gradient(90deg, rgb(246 248 255 / 0.96), rgb(102 231 216 / 0.92), #7db7ff);
  box-shadow: 0 0 22px rgb(102 231 216 / 0.28);
}

.timeline-track::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgb(255 255 255 / 0.12), transparent 70%);
  mix-blend-mode: screen;
  pointer-events: none;
}

.timeline-input {
  position: absolute;
  inset: 0;
  width: 100%;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.timeline-input::-webkit-slider-runnable-track {
  height: 16px;
  background: transparent;
}

.timeline-input::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  margin-top: -2px;
  border-radius: 50%;
  border: 1px solid rgb(255 255 255 / 0.22);
  background: rgb(248 250 255 / 0.98);
  box-shadow:
    0 10px 24px rgb(0 0 0 / 0.22),
    0 0 0 5px rgb(102 231 216 / 0.14);
}

.control-strip {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.transport-cluster,
.volume-cluster {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.06), rgb(255 255 255 / 0.02)),
    rgb(255 255 255 / 0.035);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.05);
}

.transport-button,
.play-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: var(--text-main);
  border-radius: 50%;
}

.transport-button {
  width: 40px;
  height: 40px;
  background: rgb(255 255 255 / 0.06);
}

.play-button {
  width: 50px;
  height: 50px;
  background:
    radial-gradient(circle at 30% 20%, rgb(255 255 255 / 0.2), transparent 24%),
    linear-gradient(135deg, rgb(102 231 216 / 0.46), rgb(102 231 216 / 0.12)),
    rgb(16 24 35 / 0.96);
  box-shadow:
    0 16px 28px rgb(0 0 0 / 0.22),
    inset 0 1px 0 rgb(255 255 255 / 0.12);
}

.volume-cluster {
  min-width: min(100%, 280px);
  padding-right: 12px;
  color: var(--text-soft);
}

.volume-icon {
  width: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
}

.volume-track {
  position: relative;
  flex: 1;
  min-width: 120px;
  height: 12px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.05);
  overflow: hidden;
}

.volume-track-fill {
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgb(255 255 255 / 0.92), rgb(102 231 216 / 0.88));
}

.volume-track input {
  position: absolute;
  inset: 0;
  width: 100%;
  margin: 0;
  appearance: none;
  background: transparent;
}

.volume-track input::-webkit-slider-runnable-track {
  height: 12px;
  background: transparent;
}

.volume-track input::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  margin-top: -1px;
  border-radius: 50%;
  border: 1px solid rgb(255 255 255 / 0.22);
  background: rgb(248 250 255 / 0.96);
  box-shadow: 0 0 0 4px rgb(102 231 216 / 0.12);
}

.volume-value {
  min-width: 48px;
  text-align: right;
  color: var(--text-main);
  font-size: 0.86rem;
}

.queue-panel {
  margin-top: 16px;
}

.audio-panel.matched-height .queue-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.queue-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 4px 12px;
}

.queue-label {
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-cyan);
}

.queue-meta {
  color: var(--text-soft);
  font-size: 0.88rem;
}

.queue-list {
  display: grid;
  gap: 10px;
  list-style: none;
  max-height: min(320px, 34vh);
  padding-right: 6px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.audio-panel.matched-height .queue-list {
  flex: 1;
  min-height: 0;
  max-height: none;
}

.queue-list::-webkit-scrollbar {
  width: 8px;
}

.queue-list::-webkit-scrollbar-track {
  background: transparent;
}

.queue-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(255 255 255 / 0.14);
}

.queue-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 20px;
  border: 1px solid rgb(255 255 255 / 0.08);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.04), rgb(255 255 255 / 0.02)),
    rgb(255 255 255 / 0.02);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.queue-item:hover {
  transform: translateY(-1px);
  border-color: rgb(255 255 255 / 0.12);
}

.queue-item.active {
  border-color: rgb(255 255 255 / 0.16);
  background:
    linear-gradient(135deg, rgb(102 231 216 / 0.14), rgb(255 255 255 / 0.03)),
    rgb(255 255 255 / 0.04);
}

.queue-index {
  color: rgb(220 233 255 / 0.48);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}

.queue-copy {
  min-width: 0;
}

.queue-copy strong,
.queue-copy span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.queue-copy strong {
  color: var(--text-main);
  font-size: 1rem;
}

.queue-copy span {
  margin-top: 4px;
  color: var(--text-soft);
  font-size: 0.9rem;
}

.queue-state {
  min-width: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.05);
  color: var(--text-soft);
  font-size: 0.78rem;
  text-transform: uppercase;
}

.queue-state.live {
  color: var(--text-main);
}

.eq-bar {
  width: 3px;
  height: 12px;
  border-radius: 999px;
  background: var(--accent-cyan);
  animation: eq-wave 0.9s ease-in-out infinite;
}

.eq-bar:nth-child(2) {
  animation-delay: 0.12s;
}

.eq-bar:nth-child(3) {
  animation-delay: 0.24s;
}

.queue-empty {
  padding: 18px 4px 0;
  color: var(--text-soft);
}

.engine-player {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.queue-enter-active,
.queue-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.queue-enter-from,
.queue-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes eq-wave {
  0%,
  100% {
    transform: scaleY(0.45);
    opacity: 0.5;
  }

  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

@media (max-width: 900px) {
  .stage-main {
    grid-template-columns: 1fr;
  }

  .cover-stack {
    width: min(100%, 220px);
    height: auto;
    aspect-ratio: 1;
  }
}

@media (max-width: 640px) {
  .audio-panel {
    padding: 20px;
  }

  .panel-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .queue-toggle {
    align-self: stretch;
    justify-content: space-between;
  }

  .player-stage {
    padding: 18px;
    border-radius: 24px;
  }

  .stage-main {
    gap: 18px;
  }

  .track-topline {
    flex-wrap: wrap;
  }

  .stage-copy h3 {
    font-size: 2.1rem;
  }

  .control-strip {
    align-items: stretch;
  }

  .transport-cluster,
  .volume-cluster {
    width: 100%;
    justify-content: center;
  }

  .queue-item {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .queue-state {
    grid-column: 2;
    justify-self: start;
  }

  .queue-list {
    max-height: min(280px, 42vh);
  }
}
</style>
