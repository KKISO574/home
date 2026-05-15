<template>
  <div
    class="ambient-backdrop"
    :class="[`scene-${scene}`, { 'is-active': pointerActive }]"
    :style="backdropStyle"
    aria-hidden="true"
  >
    <img class="ambient-image" :src="image" alt="" decoding="async" @error="hideBrokenImage" />
    <div class="ambient-mesh" />
    <div class="ambient-focus" />
    <div class="ambient-rings" />
    <div class="ambient-hud">
      <span class="hud-tag">{{ activeTag }}</span>
      <span class="hud-meta">{{ activeMeta }}</span>
    </div>
    <div class="ambient-copy-base">
      <span v-for="(token, index) in tokenGrid" :key="`base-${token}-${index}`">{{ token }}</span>
    </div>
    <div class="ambient-copy-reveal">
      <span v-for="(token, index) in revealGrid" :key="`reveal-${token}-${index}`">{{ token }}</span>
    </div>

    <svg class="ambient-links" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line
        v-for="link in activeLinks"
        :key="link.id"
        :x1="renderX"
        :y1="renderY"
        :x2="link.x"
        :y2="link.y"
        :style="{
          opacity: link.opacity,
          strokeWidth: link.width,
        }"
      />
    </svg>

    <div class="ambient-streams">
      <span
        v-for="stream in streams"
        :key="stream.id"
        class="stream-line"
        :style="{
          '--stream-top': stream.top,
          '--stream-left': stream.left,
          '--stream-width': stream.width,
          '--stream-depth': stream.depth,
          '--stream-rotate': stream.rotate,
          '--stream-delay': stream.delay,
        }"
      />
    </div>

    <div class="ambient-ripples">
      <span
        v-for="ripple in ripples"
        :key="ripple.id"
        class="click-ripple"
        :style="{
          '--ripple-x': `${ripple.x}%`,
          '--ripple-y': `${ripple.y}%`,
        }"
      />
    </div>

    <div class="ambient-field">
      <span
        v-for="node in nodes"
        :key="node.id"
        class="field-node"
        :style="{
          '--node-top': node.top,
          '--node-left': node.left,
          '--node-size': `${node.size}px`,
          '--node-depth': node.depth,
          '--node-delay': node.delay,
        }"
      />
    </div>

    <div class="ambient-shade" />
    <div class="ambient-scanlines" />
    <div class="ambient-noise" />
  </div>
</template>

<script setup>
import { useSceneInteraction } from "@/composables/useSceneInteraction.js";

const props = defineProps({
  image: {
    type: String,
    required: true,
  },
});

const { scene, activeTarget, sceneTitle, sceneAction } = useSceneInteraction();
const pointerX = ref(52);
const pointerY = ref(34);
const renderX = ref(52);
const renderY = ref(34);
const driftX = ref(0);
const driftY = ref(0);
const targetDriftX = ref(0);
const targetDriftY = ref(0);
const pointerActive = ref(false);
const ripples = ref([]);

let frameId = 0;

const hideBrokenImage = (event) => {
  event.target.style.opacity = "0";
};

const nodes = [
  { id: "n1", top: "14%", left: "10%", size: 8, depth: 0.72, delay: "0s" },
  { id: "n2", top: "22%", left: "28%", size: 6, depth: 0.54, delay: "0.3s" },
  { id: "n3", top: "12%", left: "52%", size: 10, depth: 0.82, delay: "0.8s" },
  { id: "n4", top: "18%", left: "78%", size: 7, depth: 0.6, delay: "1.1s" },
  { id: "n5", top: "42%", left: "16%", size: 6, depth: 0.46, delay: "0.5s" },
  { id: "n6", top: "56%", left: "34%", size: 9, depth: 0.76, delay: "1.4s" },
  { id: "n7", top: "48%", left: "62%", size: 7, depth: 0.58, delay: "0.9s" },
  { id: "n8", top: "66%", left: "82%", size: 10, depth: 0.9, delay: "0.2s" },
  { id: "n9", top: "78%", left: "22%", size: 8, depth: 0.62, delay: "1.7s" },
  { id: "n10", top: "84%", left: "52%", size: 6, depth: 0.4, delay: "0.7s" },
];

const streams = [
  { id: "s1", top: "16%", left: "4%", width: "26%", depth: 0.32, rotate: "0deg", delay: "0s" },
  { id: "s2", top: "28%", left: "58%", width: "18%", depth: 0.52, rotate: "-14deg", delay: "0.5s" },
  { id: "s3", top: "48%", left: "20%", width: "22%", depth: 0.44, rotate: "12deg", delay: "1.1s" },
  { id: "s4", top: "68%", left: "56%", width: "24%", depth: 0.68, rotate: "0deg", delay: "1.6s" },
  { id: "s5", top: "82%", left: "8%", width: "32%", depth: 0.28, rotate: "-8deg", delay: "0.9s" },
];

const sceneConfigs = {
  hero: {
    primary: "102 231 216",
    secondary: "245 185 113",
    focus: "620px",
    revealSize: "230px",
    linkReach: 28,
    tokens: ["CELIA", "HOME", "HELLO", "7BOE", "NOTES", "MUSIC"],
    revealWords: ["HELLO", "你好", "CELIA", "7BOE.TOP"],
  },
  live: {
    primary: "125 183 255",
    secondary: "102 231 216",
    focus: "540px",
    revealSize: "210px",
    linkReach: 24,
    tokens: ["TODAY", "TIME", "WEATHER", "QUOTE", "DATE", "NOW"],
    revealWords: ["TODAY", "TIME", "WEATHER", "QUOTE"],
  },
  links: {
    primary: "102 231 216",
    secondary: "125 183 255",
    focus: "700px",
    revealSize: "280px",
    linkReach: 34,
    tokens: ["BLOG", "CLOUD", "TOOLS", "MUSIC", "LINKS", "OPEN"],
    revealWords: ["OPEN", "7BOE.TOP", "入口", "BLOG"],
  },
  music: {
    primary: "245 185 113",
    secondary: "102 231 216",
    focus: "680px",
    revealSize: "260px",
    linkReach: 30,
    tokens: ["MUSIC", "PLAY", "LYRIC", "QUEUE", "NE-YO", "VOLUME"],
    revealWords: ["PLAY", "SO SICK", "歌词", "QUEUE"],
  },
  contact: {
    primary: "236 244 255",
    secondary: "245 185 113",
    focus: "560px",
    revealSize: "240px",
    linkReach: 32,
    tokens: ["GITHUB", "EMAIL", "QQ", "STEAM", "CONTACT", "CELIA"],
    revealWords: ["CONTACT", "CELIA", "Github", "Email"],
  },
};

const activeConfig = computed(() => sceneConfigs[scene.value] || sceneConfigs.hero);
const activeRevealWords = computed(() => {
  if (!activeTarget.value) return activeConfig.value.revealWords;
  return [activeTarget.value, ...activeConfig.value.revealWords].slice(0, 6);
});
const tokenGrid = computed(() =>
  Array.from({ length: 24 }, (_, index) => activeConfig.value.tokens[index % activeConfig.value.tokens.length]),
);
const revealGrid = computed(() =>
  Array.from({ length: 24 }, (_, index) => activeRevealWords.value[index % activeRevealWords.value.length]),
);

const activeTag = computed(() => sceneTitle.value);
const activeMeta = computed(() => sceneAction.value);

const activeLinks = computed(() =>
  nodes
    .map((node) => {
      const x = parseFloat(node.left);
      const y = parseFloat(node.top);
      const dx = renderX.value - x;
      const dy = renderY.value - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const opacity = Math.max(0, 1 - distance / activeConfig.value.linkReach);

      return {
        id: node.id,
        x,
        y,
        opacity: Number((opacity * 0.82).toFixed(3)),
        width: opacity > 0.72 ? 0.32 : 0.18,
      };
    })
    .filter((link) => link.opacity > 0.04),
);

const commitPointer = () => {
  frameId = 0;
  renderX.value = pointerX.value;
  renderY.value = pointerY.value;
  driftX.value = targetDriftX.value;
  driftY.value = targetDriftY.value;
};

const updatePointer = (event) => {
  if (event.pointerType === "touch") return;

  const x = event.clientX / window.innerWidth;
  const y = event.clientY / window.innerHeight;

  pointerX.value = x * 100;
  pointerY.value = y * 100;
  targetDriftX.value = (x - 0.5) * 56;
  targetDriftY.value = (y - 0.5) * 48;
  pointerActive.value = true;

  if (!frameId) {
    frameId = window.requestAnimationFrame(commitPointer);
  }
};

const createRipple = (event) => {
  if (event.pointerType === "touch") return;

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;

  ripples.value = [...ripples.value, { id, x, y }];

  window.setTimeout(() => {
    ripples.value = ripples.value.filter((ripple) => ripple.id !== id);
  }, 1400);
};

const resetPointer = () => {
  pointerX.value = 52;
  pointerY.value = 34;
  targetDriftX.value = 0;
  targetDriftY.value = 0;
  renderX.value = pointerX.value;
  renderY.value = pointerY.value;
  driftX.value = 0;
  driftY.value = 0;
  pointerActive.value = false;
};

const backdropStyle = computed(() => ({
  "--pointer-x": `${renderX.value}%`,
  "--pointer-y": `${renderY.value}%`,
  "--drift-x": driftX.value,
  "--drift-y": driftY.value,
  "--scene-primary": activeConfig.value.primary,
  "--scene-secondary": activeConfig.value.secondary,
  "--focus-size": activeConfig.value.focus,
  "--reveal-size": activeConfig.value.revealSize,
}));

onMounted(() => {
  window.addEventListener("pointermove", updatePointer);
  window.addEventListener("pointerdown", createRipple);
  window.addEventListener("pointerleave", resetPointer);
  window.addEventListener("blur", resetPointer);
});

onBeforeUnmount(() => {
  window.cancelAnimationFrame(frameId);
  window.removeEventListener("pointermove", updatePointer);
  window.removeEventListener("pointerdown", createRipple);
  window.removeEventListener("pointerleave", resetPointer);
  window.removeEventListener("blur", resetPointer);
});
</script>

<style lang="scss" scoped>
.ambient-backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(circle at top, rgb(255 255 255 / 0.02), transparent 28%),
    #070b11;
  transition: background 0.32s ease;
}

.ambient-backdrop::before {
  content: "";
  position: absolute;
  inset: -18%;
  background:
    conic-gradient(
      from 18deg at var(--pointer-x) var(--pointer-y),
      transparent 0deg,
      rgb(var(--scene-primary) / 0.1) 46deg,
      transparent 92deg,
      rgb(var(--scene-secondary) / 0.08) 160deg,
      transparent 236deg,
      rgb(244 248 255 / 0.05) 290deg,
      transparent 360deg
    );
  opacity: 0.62;
  transform: translate3d(calc(var(--drift-x) * 0.36px), calc(var(--drift-y) * 0.36px), 0);
}

.ambient-image,
.ambient-mesh,
.ambient-focus,
.ambient-rings,
.ambient-hud,
.ambient-copy-base,
.ambient-copy-reveal,
.ambient-links,
.ambient-streams,
.ambient-ripples,
.ambient-field,
.ambient-shade,
.ambient-scanlines,
.ambient-noise {
  position: absolute;
  inset: 0;
}

.ambient-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.22;
  transform: scale(1.04)
    translate3d(calc(var(--drift-x) * -0.26px), calc(var(--drift-y) * -0.26px), 0);
  filter: saturate(0.9) contrast(1.08) brightness(0.64);
  transition: transform 0.18s ease;
  background:
    radial-gradient(circle at 24% 24%, rgb(102 231 216 / 0.1), transparent 26%),
    radial-gradient(circle at 76% 70%, rgb(245 185 113 / 0.08), transparent 28%),
    #070b11;
}

.ambient-mesh {
  background-image:
    linear-gradient(rgb(255 255 255 / 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 0.035) 1px, transparent 1px),
    linear-gradient(rgb(102 231 216 / 0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgb(102 231 216 / 0.028) 1px, transparent 1px);
  background-size:
    72px 72px,
    72px 72px,
    216px 216px,
    216px 216px;
  transform: translate3d(calc(var(--drift-x) * 0.45px), calc(var(--drift-y) * 0.45px), 0);
  mask-image: linear-gradient(to bottom, rgb(0 0 0 / 0.88), transparent 94%);
  opacity: 0.72;
  transition: transform 0.18s linear;
}

.ambient-focus {
  background:
    radial-gradient(
      var(--focus-size) circle at var(--pointer-x) var(--pointer-y),
      rgb(var(--scene-primary) / 0.34),
      transparent 40%
    ),
    radial-gradient(
      260px circle at var(--pointer-x) var(--pointer-y),
      rgb(244 248 255 / 0.2),
      transparent 52%
    ),
    radial-gradient(circle at 84% 12%, rgb(var(--scene-secondary) / 0.14), transparent 24%);
  mix-blend-mode: screen;
}

.ambient-rings {
  background:
    radial-gradient(
      circle at var(--pointer-x) var(--pointer-y),
      transparent 0 78px,
      rgb(244 248 255 / 0.14) 78px 79px,
      transparent 79px 136px,
      rgb(var(--scene-primary) / 0.18) 136px 137px,
      transparent 137px 194px,
      rgb(var(--scene-secondary) / 0.12) 194px 195px,
      transparent 195px 100%
    );
  opacity: 0.96;
}

.ambient-hud {
  left: min(calc(var(--pointer-x) + 28px), calc(100% - 170px));
  top: clamp(16px, calc(var(--pointer-y) - 18px), calc(100% - 56px));
  right: auto;
  bottom: auto;
  width: auto;
  height: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.14);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.12), rgb(255 255 255 / 0.04)),
    rgb(10 16 26 / 0.62);
  box-shadow:
    0 12px 32px rgb(0 0 0 / 0.24),
    inset 0 1px 0 rgb(255 255 255 / 0.1);
  transform: translate3d(calc(var(--drift-x) * 0.32px), calc(var(--drift-y) * 0.32px), 0);
}

.hud-tag,
.hud-meta {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hud-tag {
  color: var(--text-main);
}

.hud-meta {
  color: rgb(var(--scene-primary) / 1);
}

.ambient-copy-base,
.ambient-copy-reveal {
  display: none;
  padding: 5vh 4vw;
  gap: 5vh 2vw;
  align-content: stretch;
  user-select: none;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.28s ease;
}

.ambient-backdrop.is-active .ambient-copy-base,
.ambient-backdrop.is-active .ambient-copy-reveal {
  opacity: 1;
}

.ambient-copy-base {
  transform: translate3d(calc(var(--drift-x) * 0.2px), calc(var(--drift-y) * 0.2px), 0);
}

.ambient-copy-base span,
.ambient-copy-reveal span {
  justify-self: center;
  align-self: center;
  font-size: clamp(1rem, 2vw, 2rem);
}

.ambient-copy-base span {
  color: rgb(255 255 255 / 0.045);
}

.ambient-copy-reveal {
  color: rgb(244 248 255 / 0.34);
  transform: translate3d(calc(var(--drift-x) * 0.26px), calc(var(--drift-y) * 0.26px), 0);
  mask-image: radial-gradient(
    var(--reveal-size) circle at var(--pointer-x) var(--pointer-y),
    rgb(0 0 0 / 0.96) 0,
    rgb(0 0 0 / 0.96) 30%,
    transparent 72%
  );
  -webkit-mask-image: radial-gradient(
    var(--reveal-size) circle at var(--pointer-x) var(--pointer-y),
    rgb(0 0 0 / 0.96) 0,
    rgb(0 0 0 / 0.96) 30%,
    transparent 72%
  );
}

.ambient-links {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ambient-links line {
  stroke: rgb(var(--scene-primary) / 0.9);
  filter: drop-shadow(0 0 8px rgb(var(--scene-primary) / 0.28));
}

.ambient-streams {
  transform: translate3d(calc(var(--drift-x) * 0.3px), calc(var(--drift-y) * 0.3px), 0);
}

.stream-line {
  position: absolute;
  top: var(--stream-top);
  left: var(--stream-left);
  width: var(--stream-width);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.18), transparent);
  opacity: 0.42;
  transform: translate3d(
      calc(var(--drift-x) * var(--stream-depth) * 1px),
      calc(var(--drift-y) * var(--stream-depth) * 1px),
      0
    )
    rotate(var(--stream-rotate));
  animation: streamPulse 5.4s ease-in-out infinite;
  animation-delay: var(--stream-delay);
}

.ambient-ripples {
  overflow: hidden;
}

.click-ripple {
  position: absolute;
  left: var(--ripple-x);
  top: var(--ripple-y);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgb(244 248 255 / 0.5);
  background: radial-gradient(circle, rgb(var(--scene-primary) / 0.24), transparent 56%);
  transform: translate(-50%, -50%);
  animation: rippleWave 1.4s cubic-bezier(0.18, 0.8, 0.2, 1) forwards;
}

.ambient-field {
  transform: translate3d(calc(var(--drift-x) * 0.2px), calc(var(--drift-y) * 0.2px), 0);
}

.field-node {
  position: absolute;
  top: var(--node-top);
  left: var(--node-left);
  width: var(--node-size);
  height: var(--node-size);
  border-radius: 50%;
  background: rgb(var(--scene-primary) / 0.9);
  box-shadow:
    0 0 0 6px rgb(var(--scene-primary) / 0.08),
    0 0 18px rgb(var(--scene-primary) / 0.2);
  transform: translate3d(
    calc(var(--drift-x) * var(--node-depth) * 1px),
    calc(var(--drift-y) * var(--node-depth) * 1px),
    0
  );
  animation: nodePulse 4.8s ease-in-out infinite;
  animation-delay: var(--node-delay);
}

.field-node:nth-child(3n) {
  background: rgb(var(--scene-secondary) / 0.88);
  box-shadow:
    0 0 0 6px rgb(var(--scene-secondary) / 0.07),
    0 0 18px rgb(var(--scene-secondary) / 0.18);
}

.ambient-shade {
  background:
    linear-gradient(180deg, rgb(7 11 17 / 0.24) 0%, rgb(7 11 17 / 0.76) 42%, #070b11 100%),
    linear-gradient(90deg, rgb(7 11 17 / 0.92) 0%, rgb(7 11 17 / 0.38) 34%, rgb(7 11 17 / 0.8) 100%);
}

.ambient-scanlines {
  background:
    repeating-linear-gradient(
      180deg,
      transparent 0 6px,
      rgb(255 255 255 / 0.014) 6px 7px
    ),
    linear-gradient(
      90deg,
      transparent 0,
      rgb(var(--scene-primary) / 0.08) 48%,
      transparent 100%
    );
  background-position:
    0 0,
    calc(var(--pointer-x) - 20%) 0;
  opacity: 0.54;
  mix-blend-mode: screen;
}

.ambient-noise {
  background:
    radial-gradient(circle at 20% 18%, rgb(255 255 255 / 0.04), transparent 18%),
    radial-gradient(circle at 82% 72%, rgb(255 255 255 / 0.04), transparent 22%);
  opacity: 0.34;
}

@keyframes nodePulse {
  0%,
  100% {
    opacity: 0.42;
    transform: translate3d(
        calc(var(--drift-x) * var(--node-depth) * 1px),
        calc(var(--drift-y) * var(--node-depth) * 1px),
        0
      )
      scale(0.86);
  }

  50% {
    opacity: 1;
    transform: translate3d(
        calc(var(--drift-x) * var(--node-depth) * 1px),
        calc(var(--drift-y) * var(--node-depth) * 1px),
        0
      )
      scale(1.08);
  }
}

@keyframes streamPulse {
  0%,
  100% {
    opacity: 0.16;
  }

  50% {
    opacity: 0.7;
  }
}

@keyframes rippleWave {
  0% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(0.45);
  }

  70% {
    opacity: 0.42;
    transform: translate(-50%, -50%) scale(7.8);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(11);
  }
}

@media (max-width: 900px) {
  .ambient-image {
    opacity: 0.18;
    transform: none;
  }

  .ambient-rings,
  .ambient-streams {
    opacity: 0.65;
  }

  .ambient-copy-base,
  .ambient-copy-reveal,
  .ambient-links,
  .ambient-streams,
  .ambient-hud {
    display: none;
  }

  .ambient-mesh {
    background-size:
      54px 54px,
      54px 54px,
      162px 162px,
      162px 162px;
    transform: none;
  }
}
</style>
