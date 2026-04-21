<template>
  <div class="ambient-backdrop" aria-hidden="true">
    <img class="ambient-image" :src="image" alt="" />
    <div class="ambient-shade" />
    <div class="ambient-scan" />
  </div>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.ambient-backdrop {
  position: fixed;
  inset: 0;
  z-index: -2;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgb(6 11 18 / 0.15), rgb(6 11 18 / 0.82)),
    #070b11;
}

.ambient-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.28;
  transform: scale(1.05);
  animation: ambientDrift 24s ease-in-out infinite alternate;
  filter: saturate(0.9) contrast(1.08) brightness(0.68);
}

.ambient-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgb(7 11 17 / 0.28) 0%, rgb(7 11 17 / 0.78) 44%, #070b11 100%),
    linear-gradient(90deg, rgb(7 11 17 / 0.92) 0%, rgb(7 11 17 / 0.46) 36%, rgb(7 11 17 / 0.82) 100%);
}

.ambient-scan {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 0%, rgb(102 231 216 / 0.08) 48%, transparent 100%),
    linear-gradient(180deg, transparent 0%, rgb(245 185 113 / 0.1) 100%);
  mix-blend-mode: screen;
  opacity: 0.55;
}

@keyframes ambientDrift {
  from {
    transform: scale(1.05) translate3d(0, 0, 0);
  }
  to {
    transform: scale(1.12) translate3d(-1.6%, -0.8%, 0);
  }
}
</style>
