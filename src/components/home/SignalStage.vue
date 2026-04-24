<template>
  <section
    ref="stageRef"
    class="signal-stage"
    :class="{ 'is-active': pointerActive }"
    :style="stageStyle"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <div class="signal-base-grid" aria-hidden="true">
      <span v-for="(token, index) in tokenGrid" :key="`base-${token}-${index}`">{{ token }}</span>
    </div>

    <div class="signal-hidden-grid" aria-hidden="true">
      <span v-for="(token, index) in hiddenGrid" :key="`hidden-${token}-${index}`">{{ token }}</span>
    </div>

    <div class="signal-glow" aria-hidden="true" />

    <div class="signal-layout">
      <div class="signal-copy">
        <p class="signal-kicker">Celia / Personal Home</p>
        <h1 class="signal-title">{{ siteName }}</h1>
        <p class="signal-summary">{{ summary }}</p>

        <div class="signal-actions">
          <a class="signal-button primary" href="#workbench">常用入口</a>
          <a class="signal-button secondary" href="#media">音乐与联系</a>
        </div>

        <ul class="signal-feed">
          <li>{{ dateLine }}</li>
          <li>{{ timeLine }}</li>
          <li>{{ weatherLine || "天气数据更新中" }}</li>
          <li>近况 / 音乐 / 联系 / 入口</li>
        </ul>
      </div>

      <div class="signal-visual">
        <div class="signal-orb">
          <div class="orb-noise" aria-hidden="true" />
          <span class="orb-kicker">Hello</span>
          <strong class="orb-word">{{ activeWord }}</strong>
          <span class="orb-subtitle">{{ activeSecondary }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  siteName: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  dateLine: {
    type: String,
    required: true,
  },
  timeLine: {
    type: String,
    required: true,
  },
  weatherLine: {
    type: String,
    default: "",
  },
});

const stageRef = ref(null);
const pointerX = ref(50);
const pointerY = ref(50);
const deltaX = ref(0);
const deltaY = ref(0);
const pointerActive = ref(false);

const tokenGrid = computed(() => [
  "CELIA",
  "MUSIC",
  "LINKS",
  "HELLO",
  "NOTES",
  "CONTACT",
  "CELIA",
  "MUSIC",
  "LINKS",
  "HELLO",
  "NOTES",
  "CONTACT",
  "CELIA",
  "MUSIC",
  "LINKS",
  "HELLO",
  "NOTES",
  "CONTACT",
]);

const hiddenGrid = computed(() =>
  Array.from({ length: 24 }, (_, index) => (index % 2 === 0 ? "HELLO" : "你好")),
);

const activeWord = computed(() => (pointerX.value < 50 ? "HELLO" : "你好"));
const activeSecondary = computed(() => (pointerY.value < 50 ? "7BOE.TOP" : "ONLINE"));

const stageStyle = computed(() => ({
  "--pointer-x": `${pointerX.value}%`,
  "--pointer-y": `${pointerY.value}%`,
  "--delta-x": `${deltaX.value}px`,
  "--delta-y": `${deltaY.value}px`,
}));

const onPointerMove = (event) => {
  if (!stageRef.value) return;
  const rect = stageRef.value.getBoundingClientRect();
  const relativeX = (event.clientX - rect.left) / rect.width;
  const relativeY = (event.clientY - rect.top) / rect.height;

  pointerX.value = relativeX * 100;
  pointerY.value = relativeY * 100;
  deltaX.value = (relativeX - 0.5) * 80;
  deltaY.value = (relativeY - 0.5) * 52;
  pointerActive.value = true;
};

const onPointerLeave = () => {
  pointerX.value = 50;
  pointerY.value = 50;
  deltaX.value = 0;
  deltaY.value = 0;
  pointerActive.value = false;
};
</script>

<style lang="scss" scoped>
.signal-stage {
  position: relative;
  overflow: hidden;
  min-height: 560px;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.04), rgb(255 255 255 / 0.012)),
    rgb(8 13 22 / 0.78);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.04),
    0 26px 60px rgb(0 0 0 / 0.24);
  backdrop-filter: blur(18px);
}

.signal-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 24%, rgb(102 231 216 / 0.08), transparent 26%),
    radial-gradient(circle at 78% 74%, rgb(245 185 113 / 0.08), transparent 24%);
  pointer-events: none;
}

.signal-base-grid,
.signal-hidden-grid,
.signal-glow,
.signal-layout {
  position: absolute;
  inset: 0;
}

.signal-base-grid,
.signal-hidden-grid {
  padding: 28px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px 24px;
  align-content: stretch;
  user-select: none;
}

.signal-base-grid {
  transform: translate3d(calc(var(--delta-x) * 0.12), calc(var(--delta-y) * 0.12), 0);
  opacity: 0;
  transition:
    opacity 0.28s ease,
    transform 0.18s ease;
}

.signal-stage.is-active .signal-base-grid {
  opacity: 1;
}

.signal-base-grid span,
.signal-hidden-grid span {
  justify-self: center;
  align-self: center;
  font-size: clamp(2rem, 4.2vw, 4.8rem);
  font-weight: 700;
  letter-spacing: 0.06em;
}

.signal-base-grid span {
  color: rgb(255 255 255 / 0.045);
}

.signal-hidden-grid {
  color: rgb(244 248 255 / 0.22);
  transform: translate3d(calc(var(--delta-x) * 0.18), calc(var(--delta-y) * 0.18), 0);
  opacity: 0;
  transition:
    opacity 0.24s ease,
    transform 0.12s ease;
  mask-image: radial-gradient(
    220px circle at var(--pointer-x) var(--pointer-y),
    rgb(0 0 0 / 0.96) 0,
    rgb(0 0 0 / 0.96) 36%,
    transparent 68%
  );
  -webkit-mask-image: radial-gradient(
    220px circle at var(--pointer-x) var(--pointer-y),
    rgb(0 0 0 / 0.96) 0,
    rgb(0 0 0 / 0.96) 36%,
    transparent 68%
  );
}

.signal-stage.is-active .signal-hidden-grid {
  opacity: 1;
}

.signal-glow {
  background:
    radial-gradient(
      260px circle at var(--pointer-x) var(--pointer-y),
      rgb(102 231 216 / 0.16),
      rgb(255 255 255 / 0.05) 32%,
      transparent 72%
    );
  mix-blend-mode: screen;
}

.signal-layout {
  position: relative;
  z-index: 1;
  padding: 52px 56px;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(280px, 0.92fr);
  gap: 24px;
  align-items: center;
}

.signal-copy {
  max-width: 720px;
}

.signal-kicker {
  margin: 0 0 16px;
  font-size: 0.82rem;
  letter-spacing: 0.24em;
  color: var(--accent-cyan);
  text-transform: uppercase;
}

.signal-title {
  margin: 0;
  font-size: clamp(4rem, 8vw, 6.8rem);
  line-height: 0.92;
  letter-spacing: -0.04em;
}

.signal-summary {
  max-width: 660px;
  margin-top: 26px;
  color: var(--text-soft);
  font-size: 1.18rem;
  line-height: 1.8;
}

.signal-actions {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.signal-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.14);
  font-size: 0.96rem;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background-color 0.22s ease;
}

.signal-button.primary {
  background: linear-gradient(135deg, rgb(102 231 216 / 0.18), rgb(102 231 216 / 0.04));
  color: var(--text-main);
  box-shadow: 0 12px 32px rgb(13 24 36 / 0.24);
}

.signal-button.secondary {
  background: rgb(255 255 255 / 0.04);
  color: var(--text-soft);
}

.signal-feed {
  margin: 28px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style: none;
}

.signal-feed li {
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.04);
  color: var(--text-soft);
  font-size: 0.9rem;
  backdrop-filter: blur(12px);
}

.signal-visual {
  display: flex;
  justify-content: center;
}

.signal-orb {
  position: relative;
  width: clamp(280px, 32vw, 420px);
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid rgb(255 255 255 / 0.08);
  background:
    radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.14), transparent 16%),
    radial-gradient(circle at 35% 32%, rgb(102 231 216 / 0.18), transparent 24%),
    radial-gradient(circle at 68% 66%, rgb(245 185 113 / 0.12), transparent 22%),
    rgb(3 6 11 / 0.94);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.04),
    0 24px 64px rgb(0 0 0 / 0.26);
  transform: translate3d(calc(var(--delta-x) * 0.2), calc(var(--delta-y) * 0.16), 0);
  transition: transform 0.14s ease;
  overflow: hidden;
}

.orb-noise {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgb(255 255 255 / 0.03), transparent 32%),
    radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgb(255 255 255 / 0.08), transparent 40%);
}

.orb-kicker,
.orb-subtitle,
.orb-word {
  position: relative;
  z-index: 1;
}

.orb-kicker {
  margin-bottom: 12px;
  font-size: 0.82rem;
  letter-spacing: 0.18em;
  color: var(--accent-cyan);
  text-transform: uppercase;
}

.orb-word {
  font-size: clamp(2.4rem, 5vw, 4.2rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: rgb(244 248 255 / 0.96);
}

.orb-subtitle {
  margin-top: 14px;
  color: rgb(220 233 255 / 0.7);
  font-size: 0.95rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

@media (max-width: 1080px) {
  .signal-layout {
    grid-template-columns: 1fr;
  }

  .signal-copy {
    max-width: none;
  }

  .signal-visual {
    justify-content: flex-start;
  }
}

@media (max-width: 900px) {
  .signal-stage {
    min-height: 0;
  }

  .signal-base-grid,
  .signal-hidden-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .signal-layout {
    padding: 36px 28px 40px;
  }

  .signal-title {
    font-size: 4.2rem;
  }
}

@media (max-width: 640px) {
  .signal-base-grid,
  .signal-hidden-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    padding: 16px;
  }

  .signal-hidden-grid {
    mask-image: radial-gradient(
      160px circle at var(--pointer-x) var(--pointer-y),
      rgb(0 0 0 / 0.96) 0,
      rgb(0 0 0 / 0.96) 34%,
      transparent 70%
    );
    -webkit-mask-image: radial-gradient(
      160px circle at var(--pointer-x) var(--pointer-y),
      rgb(0 0 0 / 0.96) 0,
      rgb(0 0 0 / 0.96) 34%,
      transparent 70%
    );
  }

  .signal-layout {
    padding: 28px 20px 32px;
  }

  .signal-title {
    font-size: 3rem;
  }

  .signal-summary {
    font-size: 1rem;
  }

  .signal-orb {
    width: min(100%, 280px);
  }
}
</style>
