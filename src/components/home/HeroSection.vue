<template>
  <header id="top" class="hero-shell" @pointerenter="setScene('hero')" @focusin="setScene('hero')">
    <div class="container hero-topbar">
      <a class="brand-mark" :href="siteUrl" target="_blank" rel="noreferrer">
        <img
          class="brand-logo"
          :src="siteLogo"
          :alt="siteName"
          @error="(event) => (event.target.src = '/images/icon/logo.png')"
        />
        <div class="brand-copy">
          <span class="brand-role">{{ siteAuthor }}</span>
          <strong class="brand-domain">{{ siteUrlText }}</strong>
        </div>
      </a>

      <nav class="hero-nav" aria-label="Primary">
        <a href="#live">近况</a>
        <a href="#workbench">入口</a>
        <a href="#media">联系</a>
      </nav>
    </div>

    <div class="container hero-stage-wrap">
      <SignalStage
        :site-name="siteName"
        :summary="summary"
        :date-line="dateLine"
        :time-line="timeLine"
        :weather-line="weatherLine"
      />
    </div>

    <div class="container hero-scroll">
      <span class="scroll-label">Scroll</span>
      <span class="scroll-line" />
    </div>
  </header>
</template>

<script setup>
import SignalStage from "@/components/home/SignalStage.vue";
import { useSceneInteraction } from "@/composables/useSceneInteraction.js";

const { setScene } = useSceneInteraction();

defineProps({
  siteName: {
    type: String,
    required: true,
  },
  siteAuthor: {
    type: String,
    required: true,
  },
  siteUrl: {
    type: String,
    required: true,
  },
  siteUrlText: {
    type: String,
    required: true,
  },
  siteLogo: {
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
</script>

<style lang="scss" scoped>
.hero-shell {
  min-height: 88svh;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 0 36px;
}

.hero-topbar,
.hero-stage-wrap,
.hero-scroll {
  position: relative;
}

.hero-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-logo {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.18);
  box-shadow: 0 16px 40px rgb(0 0 0 / 0.25);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-role {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.brand-domain {
  font-size: 0.98rem;
  color: var(--text-main);
}

.hero-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 0.95rem;

  a {
    color: var(--text-soft);
  }
}

.hero-scroll {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-soft);
}

.hero-stage-wrap {
  padding: 8px 0 12px;
}

.scroll-label {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.scroll-line {
  width: 96px;
  height: 1px;
  background: linear-gradient(90deg, rgb(102 231 216 / 0.9), transparent);
}

@media (max-width: 720px) {
  .hero-shell {
    padding-bottom: 28px;
  }

  .hero-topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-nav {
    gap: 16px;
  }

  .hero-stage-wrap {
    padding-top: 0;
  }
}
</style>
