<template>
  <section id="workbench" class="section-shell" @pointerenter="setScene('links')" @focusin="setScene('links')">
    <div class="container">
      <div class="section-heading">
        <span class="section-kicker">Links</span>
        <h2>常用入口</h2>
        <p>收藏的站点、服务和日常使用入口。</p>
      </div>

      <div class="link-grid">
        <a
          v-for="item in siteLinks"
          :key="item.name"
          class="link-tile"
          :href="item.link"
          target="_blank"
          rel="noreferrer"
          @pointerenter="setActiveTarget(item.name)"
          @focus="setActiveTarget(item.name)"
          @pointerleave="clearActiveTarget"
          @blur="clearActiveTarget"
        >
          <div class="link-icon">
            <Icon size="22">
              <component :is="siteIcon[item.icon] || GlobeAlt" />
            </Icon>
          </div>

          <div class="link-copy">
            <strong>{{ item.name }}</strong>
            <span>{{ getHost(item.link) }}</span>
          </div>

          <span class="link-arrow">Open</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Icon } from "@vicons/utils";
import {
  Blog,
  Book,
  Cloud,
  CompactDisc,
  Compass,
  Fire,
  LaptopCode,
  Link as GlobeAlt,
} from "@vicons/fa";
import siteLinks from "@/assets/siteLinks.json";
import { useSceneInteraction } from "@/composables/useSceneInteraction.js";

const { setScene, setActiveTarget, clearActiveTarget } = useSceneInteraction();

const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
};

const getHost = (url) => {
  try {
    return new URL(url).host;
  } catch (error) {
    return url.replace(/^https?:\/\//, "");
  }
};
</script>

<style lang="scss" scoped>
.section-heading {
  max-width: 760px;
  margin-bottom: 28px;
}

.section-kicker {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  color: var(--accent-cyan);
  text-transform: uppercase;
}

.section-heading h2 {
  margin: 0;
  font-size: 2rem;
}

.section-heading p {
  margin: 14px 0 0;
  color: var(--text-soft);
  line-height: 1.75;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.link-tile {
  min-height: 138px;
  padding: 20px;
  border-radius: var(--radius-panel);
  border: var(--panel-border);
  background: var(--panel-bg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  box-shadow: var(--shadow-panel);
  min-width: 0;
}

.link-tile:hover,
.link-tile:focus-visible {
  transform: translateY(-4px);
  border-color: rgb(102 231 216 / 0.38);
  background:
    linear-gradient(135deg, rgb(102 231 216 / 0.12), rgb(255 255 255 / 0.03)),
    rgb(10 17 28 / 0.76);
  box-shadow:
    0 20px 52px rgb(0 0 0 / 0.3),
    0 0 34px rgb(102 231 216 / 0.1);
}

.link-icon {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgb(102 231 216 / 0.18), rgb(255 255 255 / 0.03));
  color: var(--text-main);
  transition:
    background-color 0.24s ease,
    transform 0.24s ease,
    box-shadow 0.24s ease;
}

.link-tile:hover .link-icon,
.link-tile:focus-visible .link-icon {
  transform: translateY(-2px);
  box-shadow: 0 0 24px rgb(102 231 216 / 0.18);
}

.link-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  strong {
    font-size: 1.08rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: var(--text-soft);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.link-arrow {
  color: var(--accent-amber);
  font-size: 0.86rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 960px) {
  .link-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .section-heading h2 {
    font-size: 1.6rem;
  }

  .link-grid {
    grid-template-columns: 1fr;
  }
}
</style>
