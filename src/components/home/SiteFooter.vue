<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-copy">
        <span>{{ fullYear }} {{ siteAuthor }}</span>
        <a :href="siteUrl" target="_blank" rel="noreferrer">{{ siteUrlText }}</a>
        <a v-if="siteIcp" href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">
          {{ siteIcp }}
        </a>
      </div>

      <div class="footer-track">
        <span>{{ footerTrack }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import { mainStore } from "@/store";

const audio = mainStore();
const fullYear = new Date().getFullYear();

const footerTrack = computed(() => {
  if (!audio.currentTrack.name) return "Audio standby";
  return `${audio.currentTrack.name} / ${audio.currentTrack.artist || "Unknown Artist"}`;
});

defineProps({
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
  siteIcp: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.site-footer {
  padding: 12px 0 28px;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid rgb(255 255 255 / 0.08);
}

.footer-copy,
.footer-track {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: var(--text-soft);
  font-size: 0.9rem;
  min-width: 0;
}

.footer-copy a,
.footer-track span {
  color: var(--text-soft);
  overflow-wrap: anywhere;
}

@media (max-width: 720px) {
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
