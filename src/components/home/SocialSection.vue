<template>
  <section class="social-panel" @pointerenter="setScene('contact')" @focusin="setScene('contact')">
    <div class="identity-block">
      <img
        class="identity-logo"
        :src="siteLogo"
        :alt="siteName"
        @error="(event) => (event.target.src = '/images/icon/logo.png')"
      />
      <div class="identity-copy">
        <span class="panel-kicker">Contact</span>
        <h2>联系入口</h2>
        <p>在这里找到账号、邮箱和其他社交方式。</p>
      </div>
    </div>

    <div class="identity-meta">
      <div class="meta-item">
        <span>站点</span>
        <a :href="siteUrl" target="_blank" rel="noreferrer">{{ siteUrlText }}</a>
      </div>
      <div class="meta-item">
        <span>作者</span>
        <strong>{{ siteAuthor }}</strong>
      </div>
      <div class="meta-item">
        <span>状态</span>
        <strong>{{ siteAge }}</strong>
      </div>
      <div v-if="siteIcp" class="meta-item">
        <span>备案</span>
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">{{ siteIcp }}</a>
      </div>
    </div>

    <div class="social-grid">
      <a
        v-for="item in socialLinks"
        :key="item.name"
        class="social-tile"
        :href="item.url"
        target="_blank"
        rel="noreferrer"
        @pointerenter="setActiveTarget(item.name)"
        @focus="setActiveTarget(item.name)"
        @pointerleave="clearActiveTarget"
        @blur="clearActiveTarget"
      >
        <img class="social-icon" :src="item.icon" :alt="item.name" />
        <div class="social-copy">
          <strong>{{ item.name }}</strong>
          <span>{{ item.tip }}</span>
        </div>
        <span class="social-arrow">↗</span>
      </a>
    </div>
  </section>
</template>

<script setup>
import socialLinks from "@/assets/socialLinks.json";
import { useSceneInteraction } from "@/composables/useSceneInteraction.js";

const { setScene, setActiveTarget, clearActiveTarget } = useSceneInteraction();

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
  siteIcp: {
    type: String,
    default: "",
  },
  siteAge: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.social-panel {
  padding: 24px;
  border-radius: var(--radius-panel);
  border: var(--panel-border);
  background: var(--panel-bg);
  box-shadow: var(--shadow-panel);
  min-width: 0;
}

.identity-block {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.identity-logo {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.12);
}

.panel-kicker {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  color: var(--accent-cyan);
  text-transform: uppercase;
}

.identity-copy h2 {
  margin: 0;
  font-size: 2rem;
}

.identity-copy p {
  margin: 18px 0 0;
  color: var(--text-soft);
  line-height: 1.75;
  overflow-wrap: anywhere;
}

.identity-meta {
  margin: 24px 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.meta-item {
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.08);
  background: rgb(255 255 255 / 0.03);
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    color: var(--text-soft);
    font-size: 0.84rem;
  }

  strong,
  a {
    color: var(--text-main);
    word-break: break-word;
  }
}

.social-grid {
  display: grid;
  gap: 12px;
}

.social-tile {
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.08);
  background: rgb(255 255 255 / 0.03);
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  min-width: 0;
}

.social-tile:hover,
.social-tile:focus-visible {
  transform: translateY(-3px);
  border-color: rgb(245 185 113 / 0.34);
  background:
    linear-gradient(135deg, rgb(245 185 113 / 0.1), rgb(255 255 255 / 0.03)),
    rgb(10 17 28 / 0.76);
  box-shadow:
    0 18px 42px rgb(0 0 0 / 0.26),
    0 0 28px rgb(245 185 113 / 0.08);
}

.social-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  transition: transform 0.24s ease;
}

.social-tile:hover .social-icon,
.social-tile:focus-visible .social-icon {
  transform: scale(1.06);
}

.social-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  strong {
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: var(--text-soft);
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
}

.social-arrow {
  color: var(--accent-amber);
}

@media (max-width: 640px) {
  .social-panel {
    padding: 20px;
  }

  .identity-block {
    grid-template-columns: 1fr;
  }

  .identity-copy h2 {
    font-size: 1.6rem;
  }

  .identity-meta {
    grid-template-columns: 1fr;
  }

  .social-tile {
    grid-template-columns: 36px minmax(0, 1fr) auto;
    padding: 13px 14px;
  }

  .social-icon {
    width: 36px;
    height: 36px;
  }
}
</style>
