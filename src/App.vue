<template>
  <div class="app-shell">
    <AmbientBackdrop :image="ambientImage" />
    <SpaceGateway
      v-if="!hasEntered"
      :site-name="siteName"
      :site-author="siteAuthor"
      :site-url-text="siteUrlText"
      :weather-line="weatherLine"
      @enter="enterHome"
    />

    <main v-show="hasEntered" class="page-flow" :class="{ 'is-revealed': hasEntered }">
      <HeroSection
        :site-name="siteName"
        :site-author="siteAuthor"
        :site-url="siteUrl"
        :site-url-text="siteUrlText"
        :site-logo="siteLogo"
        :summary="heroSummary"
        :date-line="dateLine"
        :time-line="timeLine"
        :weather-line="weatherLine"
      />

      <LiveOverview
        :quote="quote"
        :date-line="dateLine"
        :time-line="timeLine"
        :weather-line="weatherLine"
        :capsule-list="capsuleList"
        :site-age="siteAge"
        @refresh-quote="refreshQuote"
      />

      <LinkSection />

      <section id="media" class="section-shell media-shell">
        <div class="container media-grid">
          <MusicConsole :panel-height="matchedMediaHeight" />
          <SocialSection
            ref="socialSectionRef"
            :site-name="siteName"
            :site-author="siteAuthor"
            :site-url="siteUrl"
            :site-url-text="siteUrlText"
            :site-logo="siteLogo"
            :site-icp="siteIcp"
            :site-age="siteAge"
          />
        </div>
      </section>

      <SiteFooter
        :site-author="siteAuthor"
        :site-url="siteUrl"
        :site-url-text="siteUrlText"
        :site-icp="siteIcp"
      />
    </main>
  </div>
</template>

<script setup>
import AmbientBackdrop from "@/components/home/AmbientBackdrop.vue";
import SpaceGateway from "@/components/home/SpaceGateway.vue";
import HeroSection from "@/components/home/HeroSection.vue";
import LiveOverview from "@/components/home/LiveOverview.vue";
import LinkSection from "@/components/home/LinkSection.vue";
import MusicConsole from "@/components/home/MusicConsole.vue";
import SocialSection from "@/components/home/SocialSection.vue";
import SiteFooter from "@/components/home/SiteFooter.vue";
import { useSiteMeta } from "@/composables/useSiteMeta.js";
import { useClock } from "@/composables/useClock.js";
import { useWeather } from "@/composables/useWeather.js";
import { useHitokoto } from "@/composables/useHitokoto.js";
import { useTimeCapsule } from "@/composables/useTimeCapsule.js";
import { checkDays } from "@/utils/getTime.js";

const meta = useSiteMeta();
const { dateLine, timeLine, hourValue } = useClock();
const { weatherLine } = useWeather();
const { quote, refreshQuote } = useHitokoto();
const { capsuleList, siteAge } = useTimeCapsule(meta.startDate.value);
const { siteName, siteAuthor, siteUrl, siteUrlText, siteLogo, siteIcp, descriptionPrimary } = meta;
const socialSectionRef = ref(null);
const matchedMediaHeight = ref(null);
const hasEntered = ref(false);

let socialObserver = null;

const heroSummary = computed(() => {
  const fragments = [descriptionPrimary.value, "记录近况、常用入口和联系方式。"].filter(Boolean);
  return fragments.join(" ");
});

const ambientImage = computed(() => {
  if (hourValue.value < 7) return "/images/background8.jpg";
  if (hourValue.value < 12) return "/images/background4.jpg";
  if (hourValue.value < 18) return "/images/background2.jpg";
  return "/images/background10.jpg";
});

const updateMediaHeight = () => {
  if (window.innerWidth <= 1080) {
    matchedMediaHeight.value = null;
    return;
  }

  const socialElement = socialSectionRef.value?.$el;
  matchedMediaHeight.value = socialElement?.offsetHeight || null;
};

const enterHome = () => {
  hasEntered.value = true;
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    updateMediaHeight();
  });
};

onMounted(() => {
  checkDays();
  nextTick(() => {
    updateMediaHeight();

    const socialElement = socialSectionRef.value?.$el;
    if (socialElement && typeof ResizeObserver !== "undefined") {
      socialObserver = new ResizeObserver(() => {
        updateMediaHeight();
      });
      socialObserver.observe(socialElement);
    }

    window.addEventListener("resize", updateMediaHeight);
  });
});

onBeforeUnmount(() => {
  socialObserver?.disconnect();
  window.removeEventListener("resize", updateMediaHeight);
});
</script>

<style lang="scss" scoped>
.app-shell {
  position: relative;
  min-height: 100%;
}

.page-flow {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  opacity: 0;
  transform: translateY(18px);
  background:
    radial-gradient(ellipse at 50% -6%, rgb(30 118 160 / 0.22), transparent 38%),
    radial-gradient(circle at 12% 16%, rgb(102 231 216 / 0.08), transparent 22%),
    radial-gradient(circle at 88% 42%, rgb(245 185 113 / 0.07), transparent 26%);
}

.page-flow::before,
.page-flow::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.page-flow::before {
  z-index: -1;
  background-image:
    radial-gradient(circle, rgb(255 255 255 / 0.42) 0 1px, transparent 1.5px),
    radial-gradient(circle, rgb(102 231 216 / 0.38) 0 1px, transparent 1.5px);
  background-size:
    180px 180px,
    280px 280px;
  opacity: 0.18;
}

.page-flow::after {
  z-index: -1;
  background:
    linear-gradient(90deg, transparent, rgb(102 231 216 / 0.07), transparent),
    radial-gradient(ellipse at 50% 112%, rgb(16 85 120 / 0.36), transparent 42%);
  opacity: 0.62;
}

.page-flow.is-revealed {
  animation: pageReveal 0.72s ease forwards;
}

.media-shell {
  padding-top: 0;
}

.media-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  gap: 24px;
  align-items: start;
}

@media (max-width: 1080px) {
  .media-grid {
    grid-template-columns: 1fr;
  }
}

@keyframes pageReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
