<template>
  <section ref="gatewayRef" class="space-gateway" :class="{ 'is-entering': isEntering }" :style="gatewayStyle">
    <div class="starfield starfield-far" aria-hidden="true" />
    <div class="starfield starfield-near" aria-hidden="true" />
    <div class="space-rings" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>

    <div class="gateway-top">
      <div class="gateway-brand">
        <span class="brand-signal">Celia Orbit</span>
        <strong>{{ siteUrlText }}</strong>
      </div>
      <span class="gateway-location">Anhui Huainan / China</span>
    </div>

    <div class="gateway-center">
      <div class="earth-shell" aria-hidden="true">
        <div class="earth-orbit orbit-one" />
        <div class="earth-orbit orbit-two" />
        <div class="earth-glow" />
        <div class="earth">
          <div class="earth-map" />
          <div class="earth-clouds" />
          <div class="earth-grid" />
          <span class="huainan-pin">
            <span class="pin-dot" />
            <span class="pin-label">淮南 32.63°N 117.00°E</span>
          </span>
        </div>
      </div>

      <div class="gateway-copy">
        <p class="gateway-kicker">Personal home from low earth orbit</p>
        <h1>{{ siteName }}</h1>
        <p class="gateway-summary">从太空进入这座小站，落点定位在安徽淮南。</p>

        <button class="enter-button" type="button" :disabled="isEntering" @click="enter">
          <span>{{ isEntering ? "正在进入" : "进入主页" }}</span>
          <span class="enter-arrow">→</span>
        </button>
      </div>
    </div>

    <div class="gateway-bottom">
      <span>{{ siteAuthor }}</span>
      <span>{{ weatherLine || "轨道信号同步中" }}</span>
      <span>Huainan lock acquired</span>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["enter"]);

defineProps({
  siteName: {
    type: String,
    required: true,
  },
  siteAuthor: {
    type: String,
    required: true,
  },
  siteUrlText: {
    type: String,
    required: true,
  },
  weatherLine: {
    type: String,
    default: "",
  },
});

const gatewayRef = ref(null);
const pointerX = ref(50);
const pointerY = ref(50);
const isEntering = ref(false);

let enterTimer = 0;

const gatewayStyle = computed(() => ({
  "--gateway-x": `${pointerX.value}%`,
  "--gateway-y": `${pointerY.value}%`,
  "--gateway-dx": `${(pointerX.value - 50) * 0.8}px`,
  "--gateway-dy": `${(pointerY.value - 50) * 0.6}px`,
}));

const updatePointer = (event) => {
  if (!gatewayRef.value || event.pointerType === "touch") return;

  const rect = gatewayRef.value.getBoundingClientRect();
  pointerX.value = ((event.clientX - rect.left) / rect.width) * 100;
  pointerY.value = ((event.clientY - rect.top) / rect.height) * 100;
};

const enter = () => {
  if (isEntering.value) return;
  isEntering.value = true;
  enterTimer = window.setTimeout(() => {
    emit("enter");
  }, 920);
};

onMounted(() => {
  window.addEventListener("pointermove", updatePointer);
});

onBeforeUnmount(() => {
  window.clearTimeout(enterTimer);
  window.removeEventListener("pointermove", updatePointer);
});
</script>

<style lang="scss" scoped>
.space-gateway {
  position: fixed;
  inset: 0;
  z-index: 10;
  min-height: 100svh;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 28px clamp(18px, 4vw, 56px);
  background:
    radial-gradient(circle at var(--gateway-x) var(--gateway-y), rgb(102 231 216 / 0.12), transparent 28%),
    radial-gradient(circle at 70% 18%, rgb(125 183 255 / 0.13), transparent 28%),
    radial-gradient(circle at 18% 80%, rgb(245 185 113 / 0.08), transparent 24%),
    #030711;
  color: var(--text-main);
  transition:
    opacity 0.6s ease,
    transform 0.92s cubic-bezier(0.18, 0.8, 0.2, 1),
    filter 0.92s ease;
}

.space-gateway.is-entering {
  opacity: 0;
  transform: scale(1.08);
  filter: blur(8px);
  pointer-events: none;
}

.space-gateway.is-entering .gateway-top,
.space-gateway.is-entering .gateway-copy,
.space-gateway.is-entering .gateway-bottom {
  opacity: 0;
  transform: translateY(-12px);
}

.space-gateway.is-entering .earth-shell {
  transform: scale(3.25) translate3d(calc(var(--gateway-dx) * 0.06), calc(var(--gateway-dy) * 0.04), 0);
  filter: saturate(1.18) brightness(1.08);
}

.starfield,
.space-rings,
.earth-shell::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.starfield {
  background-repeat: repeat;
  transform: translate3d(calc(var(--gateway-dx) * -0.18), calc(var(--gateway-dy) * -0.18), 0);
}

.starfield-far {
  background-image:
    radial-gradient(circle, rgb(255 255 255 / 0.7) 0 1px, transparent 1.5px),
    radial-gradient(circle, rgb(102 231 216 / 0.5) 0 1px, transparent 1.5px);
  background-size:
    120px 120px,
    190px 190px;
  opacity: 0.42;
}

.starfield-near {
  background-image:
    radial-gradient(circle, rgb(255 255 255 / 0.9) 0 1px, transparent 1.6px),
    radial-gradient(circle, rgb(245 185 113 / 0.78) 0 1.2px, transparent 1.8px);
  background-size:
    260px 260px,
    360px 360px;
  background-position:
    42px 28px,
    180px 110px;
  opacity: 0.56;
  transform: translate3d(calc(var(--gateway-dx) * -0.42), calc(var(--gateway-dy) * -0.42), 0);
}

.space-rings {
  display: grid;
  place-items: center;
}

.space-rings span {
  position: absolute;
  width: min(78vw, 900px);
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid rgb(255 255 255 / 0.08);
  transform: rotateX(68deg) rotateZ(var(--ring-rotate, 0deg));
}

.space-rings span:nth-child(2) {
  --ring-rotate: 26deg;
  width: min(62vw, 720px);
  border-color: rgb(102 231 216 / 0.12);
}

.space-rings span:nth-child(3) {
  --ring-rotate: -18deg;
  width: min(92vw, 1080px);
  border-color: rgb(245 185 113 / 0.08);
}

.gateway-top,
.gateway-center,
.gateway-bottom {
  position: relative;
  z-index: 1;
}

.gateway-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  transition:
    opacity 0.42s ease,
    transform 0.42s ease;
}

.gateway-brand {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.brand-signal,
.gateway-location,
.gateway-kicker,
.gateway-bottom {
  color: var(--text-soft);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.brand-signal,
.gateway-location,
.gateway-bottom {
  font-size: 0.76rem;
}

.gateway-brand strong {
  font-size: 1rem;
}

.gateway-center {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 28px;
  text-align: center;
}

.earth-shell {
  position: relative;
  width: min(70vw, 430px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  transform: translate3d(calc(var(--gateway-dx) * 0.16), calc(var(--gateway-dy) * 0.12), 0);
  transition:
    filter 0.92s ease,
    transform 0.92s cubic-bezier(0.18, 0.8, 0.2, 1);
}

.earth-shell::before {
  content: "";
  border-radius: 50%;
  background: radial-gradient(circle, rgb(102 231 216 / 0.2), transparent 58%);
  filter: blur(18px);
}

.earth-glow {
  position: absolute;
  width: 96%;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at 34% 28%, rgb(244 248 255 / 0.34), transparent 14%),
    radial-gradient(circle, rgb(102 231 216 / 0.18), transparent 62%);
  filter: blur(18px);
}

.earth {
  position: relative;
  width: 78%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid rgb(255 255 255 / 0.18);
  background:
    radial-gradient(circle at 31% 24%, rgb(255 255 255 / 0.36), transparent 12%),
    #061123;
  box-shadow:
    inset -46px -34px 70px rgb(0 0 0 / 0.5),
    inset 18px 20px 48px rgb(255 255 255 / 0.12),
    0 0 0 18px rgb(102 231 216 / 0.03),
    0 34px 90px rgb(0 0 0 / 0.42);
}

.earth::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 4;
  background:
    radial-gradient(circle at 30% 24%, rgb(255 255 255 / 0.28), transparent 15%),
    radial-gradient(circle at 52% 45%, transparent 0 43%, rgb(0 0 0 / 0.16) 62%, rgb(0 0 0 / 0.46) 100%),
    linear-gradient(112deg, rgb(255 255 255 / 0.1), transparent 32%),
    linear-gradient(292deg, transparent 40%, rgb(1 7 18 / 0.64));
  mix-blend-mode: screen;
  pointer-events: none;
}

.earth::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 5;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.12), transparent);
  mix-blend-mode: screen;
  animation: earthScan 6.6s linear infinite;
}

.earth-map {
  position: absolute;
  inset: -2%;
  z-index: 1;
  border-radius: 50%;
  background-image: url("/images/earth-blue-marble-april.jpg");
  background-size: 258% 129%;
  background-position: 100% 0%;
  filter: saturate(1.14) contrast(1.04) brightness(0.9);
  transform: scale(1.02);
}

.earth-clouds {
  position: absolute;
  z-index: 2;
  inset: -8%;
  background:
    radial-gradient(ellipse at 25% 30%, rgb(255 255 255 / 0.26) 0 8%, transparent 18%),
    radial-gradient(ellipse at 62% 44%, rgb(255 255 255 / 0.2) 0 8%, transparent 18%),
    radial-gradient(ellipse at 46% 70%, rgb(255 255 255 / 0.18) 0 6%, transparent 16%),
    linear-gradient(102deg, transparent 0 32%, rgb(255 255 255 / 0.14) 44%, transparent 58%);
  filter: blur(7px);
  opacity: 0.58;
  animation: cloudDrift 18s linear infinite;
}

.earth-grid {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: 50%;
  background:
    repeating-linear-gradient(0deg, transparent 0 17%, rgb(255 255 255 / 0.05) 17.2% 17.7%, transparent 17.9% 34%),
    repeating-linear-gradient(90deg, transparent 0 17%, rgb(255 255 255 / 0.04) 17.2% 17.7%, transparent 17.9% 34%);
  opacity: 0.34;
  mask-image: radial-gradient(circle, rgb(0 0 0 / 0.8), transparent 72%);
  -webkit-mask-image: radial-gradient(circle, rgb(0 0 0 / 0.8), transparent 72%);
}

.huainan-pin {
  position: absolute;
  z-index: 6;
  left: 55%;
  top: 41%;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
  transform: translate(-50%, -50%);
}

.pin-dot {
  position: relative;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--accent-cyan);
  box-shadow: 0 0 0 8px rgb(102 231 216 / 0.16), 0 0 28px rgb(102 231 216 / 0.7);
}

.pin-dot::after {
  content: "";
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 1px solid rgb(102 231 216 / 0.58);
  animation: pinPulse 1.8s ease-out infinite;
}

.pin-label {
  padding: 5px 9px;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.16);
  background: rgb(3 7 17 / 0.58);
  backdrop-filter: blur(12px);
  font-size: 0.82rem;
}

.earth-orbit {
  position: absolute;
  width: 108%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid rgb(255 255 255 / 0.13);
  transform: rotateX(68deg) rotateZ(18deg);
}

.orbit-two {
  width: 122%;
  border-color: rgb(102 231 216 / 0.16);
  transform: rotateX(72deg) rotateZ(-22deg);
}

.gateway-copy {
  display: grid;
  justify-items: center;
  transition:
    opacity 0.42s ease,
    transform 0.42s ease;
}

.gateway-kicker {
  margin-bottom: 12px;
  font-size: 0.8rem;
  color: var(--accent-cyan);
}

.gateway-copy h1 {
  margin: 0;
  font-size: clamp(3.6rem, 9vw, 8rem);
  line-height: 0.88;
}

.gateway-summary {
  max-width: 620px;
  margin-top: 22px;
  color: rgb(220 233 255 / 0.76);
  font-size: clamp(1rem, 2vw, 1.18rem);
  line-height: 1.8;
}

.enter-button {
  margin-top: 30px;
  min-height: 58px;
  padding: 0 10px 0 24px;
  display: inline-flex;
  align-items: center;
  gap: 18px;
  border: 0;
  border-radius: 8px;
  background: rgb(244 248 255 / 0.92);
  color: #101723;
  box-shadow:
    0 22px 58px rgb(0 0 0 / 0.34),
    0 0 0 1px rgb(255 255 255 / 0.18);
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease;
}

.enter-button:hover,
.enter-button:focus-visible {
  transform: translateY(-3px);
  box-shadow:
    0 26px 68px rgb(0 0 0 / 0.42),
    0 0 44px rgb(102 231 216 / 0.22);
}

.enter-arrow {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--accent-cyan);
}

.gateway-bottom {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px 22px;
  text-align: center;
  transition:
    opacity 0.42s ease,
    transform 0.42s ease;
}

@keyframes pinPulse {
  to {
    opacity: 0;
    transform: scale(2.4);
  }
}

@keyframes cloudDrift {
  to {
    transform: translateX(-12%);
  }
}

@keyframes earthScan {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
}

@media (max-width: 720px) {
  .space-gateway {
    padding: 22px 16px;
  }

  .gateway-top {
    align-items: flex-start;
  }

  .gateway-location {
    max-width: 130px;
    text-align: right;
  }

  .earth-shell {
    width: min(86vw, 360px);
  }

  .gateway-copy h1 {
    font-size: clamp(3.1rem, 16vw, 5rem);
  }
}
</style>
