<template>
  <APlayer
    v-if="playList.length"
    ref="player"
    :audio="playList"
    :autoplay="audio.autoplay"
    :theme="theme"
    :autoSwitch="false"
    :loop="audio.loop"
    :order="audio.order"
    :volume="volume"
    :showLrc="false"
    :listFolded="listFolded"
    :listMaxHeight="listMaxHeight"
    :noticeSwitch="false"
    @play="onPlay"
    @pause="onPause"
    @timeupdate="onTimeUp"
    @progress="syncTimeline"
    @durationchange="syncTimeline"
    @loadedmetadata="syncTimeline"
    @canplay="syncTimeline"
    @listswitch="onListSwitch"
    @error="loadMusicError"
  />
  <div v-else class="player-placeholder">正在装载歌单…</div>
</template>

<script setup>
import { h, onMounted, ref, watch } from "vue";
import { PlayWrong } from "@icon-park/vue-next";
import APlayer from "@worstone/vue-aplayer";
import { getPlayerList } from "@/api";
import { mainStore } from "@/store";

const audio = mainStore();
const player = ref(null);
const playList = ref([]);
const playIndex = ref(0);

const props = defineProps({
  theme: {
    type: String,
    default: "#66e7d8",
  },
  volume: {
    type: Number,
    default: 0.72,
  },
  songServer: {
    type: String,
    default: "netease",
  },
  songType: {
    type: String,
    default: "playlist",
  },
  songId: {
    type: String,
    default: "",
  },
  listFolded: {
    type: Boolean,
    default: true,
  },
  listMaxHeight: {
    type: Number,
    default: 260,
  },
});

const listHeight = computed(() => `${props.listMaxHeight}px`);

const loadPlaylist = async () => {
  try {
    const result = await getPlayerList(props.songServer, props.songType, props.songId);
    if (!Array.isArray(result) || !result.length) {
      throw new Error("歌单为空");
    }
    playList.value = result;
    audio.setReady(true);
    audio.setPlaylist(result);
    audio.setCurrentIndex(0);
    audio.resetTimeline();
    if (result[0]) {
      audio.setTrack(result[0], 0);
      audio.setLyric("选择一首开始播放");
    }
  } catch (error) {
    audio.setReady(false);
    audio.setPlaylist([]);
    audio.setTrack(null, 0);
    audio.setLyric("歌单暂时无法装载");
    audio.resetTimeline();
    ElMessage({
      message: "播放器加载失败",
      grouping: true,
      icon: h(PlayWrong, {
        theme: "filled",
        fill: "#efefef",
      }),
    });
  }
};

const syncTimeline = () => {
  if (!player.value) return;
  audio.setTimeline({
    currentTime: player.value.audioStatus?.playedTime || 0,
    duration: player.value.audioStatus?.duration || 0,
    loadedTime: player.value.audioStatus?.loadedTime || 0,
  });
};

const onListSwitch = (index) => {
  if (typeof index !== "number" || !playList.value[index]) return;
  playIndex.value = index;
  audio.setTrack(playList.value[index], index);
  audio.setLyric("歌词加载中");
  audio.resetTimeline();
};

const onPlay = () => {
  if (!player.value) return;
  playIndex.value = player.value.aplayer.index;
  audio.setPlayback(true);
  audio.setTrack(playList.value[playIndex.value], playIndex.value);
  syncTimeline();
};

const onPause = () => {
  audio.setPlayback(false);
  syncTimeline();
};

const onTimeUp = () => {
  if (!player.value) return;
  const lyrics = player.value.aplayer.lyrics[playIndex.value];
  const lyricIndex = player.value.aplayer.lyricIndex;
  if (!lyrics || !lyrics[lyricIndex]) return;

  let lyricText = lyrics[lyricIndex][1];
  if (lyricText === "Loading") lyricText = "歌词加载中";
  if (lyricText === "Not available") lyricText = "歌词加载失败";
  audio.setLyric(lyricText);
  syncTimeline();
};

const playToggle = () => {
  player.value?.toggle();
};

const changeVolume = (value) => {
  const nextVolume = Number(value);
  if (!Number.isFinite(nextVolume)) return;
  player.value?.setVolume(Math.min(Math.max(nextVolume, 0), 1), false);
};

const changeSong = (direction) => {
  if (!player.value) return;
  direction === 0 ? player.value.skipBack() : player.value.skipForward();
  nextTick(() => {
    player.value?.play();
  });
};

const seekTo = (value) => {
  if (!player.value) return;
  player.value.seek(value);
  syncTimeline();
};

const playTrack = (index) => {
  if (!player.value || typeof index !== "number") return;
  player.value.switchList(index);
  nextTick(() => {
    player.value?.play();
  });
};

const toggleList = () => {
  player.value?.toggleList();
};

const loadMusicError = () => {
  const notice =
    playList.value.length > 1 ? "播放出错，播放器将在下一曲继续尝试" : "播放歌曲出现错误";
  ElMessage({
    message: notice,
    grouping: true,
    icon: h(PlayWrong, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
};

watch(
  () => props.volume,
  (value) => {
    if (typeof value === "number") {
      changeVolume(value);
    }
  },
);

onMounted(() => {
  loadPlaylist();
});

defineExpose({ playToggle, changeVolume, changeSong, toggleList, seekTo, playTrack });
</script>

<style lang="scss" scoped>
.player-placeholder {
  padding: 18px;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.08);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.05), rgb(255 255 255 / 0.02)),
    rgb(17 23 34 / 0.72);
  color: var(--text-soft);
}

.aplayer {
  margin: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.08);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.06), rgb(255 255 255 / 0.02)),
    rgb(12 18 28 / 0.76);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.04),
    0 20px 40px rgb(0 0 0 / 0.18);
  font-family:
    "HarmonyOS Sans SC",
    "HarmonyOS Sans",
    "PingFang SC",
    "Microsoft YaHei",
    sans-serif !important;
}

:deep(.aplayer-body) {
  position: relative;
  padding: 18px;
  background:
    radial-gradient(circle at top left, rgb(102 231 216 / 0.08), transparent 42%),
    radial-gradient(circle at right center, rgb(245 185 113 / 0.08), transparent 30%),
    linear-gradient(180deg, rgb(255 255 255 / 0.02), transparent);
}

:deep(.aplayer-pic) {
  width: 120px;
  height: 120px;
  margin: 0;
  border-radius: 14px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  box-shadow:
    0 18px 34px rgb(0 0 0 / 0.28),
    inset 0 0 0 1px rgb(255 255 255 / 0.08);
}

:deep(.aplayer-pic .aplayer-button) {
  background: rgb(7 11 17 / 0.5);
  border: 1px solid rgb(255 255 255 / 0.18);
  backdrop-filter: blur(12px);
}

:deep(.aplayer-info) {
  margin-left: 140px;
  min-height: 120px;
  border-bottom: none !important;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

:deep(.aplayer-info .aplayer-music) {
  margin-bottom: 14px;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

:deep(.aplayer-info .aplayer-title) {
  color: var(--text-main);
  font-size: 1.05rem;
  font-weight: 600;
}

:deep(.aplayer-info .aplayer-author) {
  color: var(--text-soft);
}

:deep(.aplayer-lrc) {
  margin: 0 0 12px;
  height: 46px;
  text-align: left;
}

:deep(.aplayer-lrc p) {
  color: var(--text-soft);
  line-height: 1.45;
}

:deep(.aplayer-lrc .aplayer-lrc-current) {
  color: var(--text-main);
  font-size: 0.94rem;
}

:deep(.aplayer-controller) {
  border-top: 1px solid rgb(255 255 255 / 0.08);
  padding-top: 12px;
}

:deep(.aplayer-bar-wrap) {
  padding: 0;
}

:deep(.aplayer-bar) {
  height: 6px !important;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08) !important;
}

:deep(.aplayer-loaded) {
  background: rgb(255 255 255 / 0.12) !important;
}

:deep(.aplayer-played) {
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-amber)) !important;
}

:deep(.aplayer-thumb) {
  width: 12px;
  height: 12px;
  background: var(--accent-cyan) !important;
  box-shadow: 0 0 0 6px rgb(102 231 216 / 0.14);
}

:deep(.aplayer-list) {
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid rgb(255 255 255 / 0.08);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.03), rgb(255 255 255 / 0.015)),
    rgb(10 15 24 / 0.7);
}

:deep(.aplayer-list ol) {
  height: v-bind(listHeight);
  padding-right: 6px;
}

:deep(.aplayer-list ol::-webkit-scrollbar) {
  width: 8px;
}

:deep(.aplayer-list ol::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.aplayer-list ol::-webkit-scrollbar-thumb) {
  border-radius: 999px;
  background: rgb(255 255 255 / 0.14);
}

:deep(.aplayer-list li) {
  position: relative;
  min-height: 54px;
  line-height: 54px;
  margin-bottom: 8px;
  padding-right: 14px;
  border-top: none;
  border-radius: 12px;
  color: var(--text-soft);
  background: transparent !important;
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}

:deep(.aplayer-list li::before) {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 3px;
  border-radius: 999px;
  background: transparent;
}

:deep(.aplayer-list li:last-child) {
  margin-bottom: 0;
}

:deep(.aplayer-list li:hover) {
  background: rgb(255 255 255 / 0.04) !important;
  transform: translateX(2px);
}

:deep(.aplayer-list li .aplayer-list-index),
:deep(.aplayer-list li .aplayer-list-author) {
  color: var(--text-soft);
}

:deep(.aplayer-list li .aplayer-list-title) {
  color: rgb(220 233 255 / 0.92);
}

:deep(.aplayer-list li.aplayer-list-light) {
  background:
    linear-gradient(
      90deg,
      rgb(102 231 216 / 0.16),
      rgb(102 231 216 / 0.04) 65%,
      rgb(245 185 113 / 0.08)
    ) !important;
  box-shadow:
    inset 0 0 0 1px rgb(102 231 216 / 0.18),
    0 10px 28px rgb(0 0 0 / 0.22);
}

:deep(.aplayer-list li.aplayer-list-light::before) {
  background: linear-gradient(180deg, var(--accent-cyan), var(--accent-amber));
}

:deep(.aplayer-list li.aplayer-list-light .aplayer-list-index),
:deep(.aplayer-list li.aplayer-list-light .aplayer-list-title),
:deep(.aplayer-list li.aplayer-list-light .aplayer-list-author) {
  color: var(--text-main) !important;
}

@media (max-width: 720px) {
  :deep(.aplayer-body) {
    padding: 16px;
  }

  :deep(.aplayer-pic) {
    width: 96px;
    height: 96px;
  }

  :deep(.aplayer-info) {
    margin-left: 114px;
    min-height: 96px;
  }
}
</style>
