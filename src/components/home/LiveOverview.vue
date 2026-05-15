<template>
  <section id="live" class="section-shell" @pointerenter="setScene('live')" @focusin="setScene('live')">
    <div class="container">
      <div class="section-heading">
        <span class="section-kicker">Overview</span>
        <h2>当前在线状态</h2>
      </div>

      <div class="overview-grid">
        <article class="quote-panel">
          <div class="panel-head">
            <div>
              <span class="panel-kicker">Quote</span>
              <h3>今日摘录</h3>
            </div>
            <button class="refresh-button" type="button" aria-label="刷新今日摘录" @click="$emit('refresh-quote')">
              <span>刷新</span>
            </button>
          </div>

          <p class="quote-text">{{ quoteText }}</p>
          <p class="quote-from">- {{ quoteFrom }}</p>

          <div class="quote-dock">
            <div>
              <span>今日时间</span>
              <strong>{{ timeLine }}</strong>
            </div>
            <div>
              <span>站点状态</span>
              <strong>{{ siteAge }}</strong>
            </div>
          </div>

          <div class="quote-meta">
            <span>{{ dateLine }}</span>
            <span>{{ weatherLine || "天气数据更新中" }}</span>
          </div>
        </article>

        <div class="metrics-grid">
          <article class="metric-tile main-tile status-tile">
            <span class="metric-label">北京时间</span>
            <strong class="metric-value">{{ timeLine }}</strong>
            <p class="metric-copy">{{ dateLine }}</p>
          </article>

          <article class="metric-tile">
            <span class="metric-label">当前天气</span>
            <p class="metric-copy strong">{{ weatherLine || "天气数据更新中" }}</p>
          </article>

          <article v-for="item in capsuleList" :key="item.key" class="metric-tile">
            <div class="metric-head">
              <span class="metric-label">{{ item.name }}</span>
              <span class="metric-percent">{{ item.percentage }}%</span>
            </div>
            <div class="metric-bar">
              <span :style="{ width: `${Math.max(Number(item.percentage), 5)}%` }" />
            </div>
            <p class="metric-copy">
              已过 {{ item.passed }}{{ item.unit }} / 剩余 {{ item.remaining }}{{ item.unit }}
            </p>
          </article>

          <article class="metric-tile age-tile">
            <span class="metric-label">站点寿命</span>
            <p class="metric-copy strong">{{ siteAge }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useSceneInteraction } from "@/composables/useSceneInteraction.js";

const { setScene } = useSceneInteraction();

defineEmits(["refresh-quote"]);

const props = defineProps({
  quote: {
    type: Object,
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
  capsuleList: {
    type: Array,
    required: true,
  },
  siteAge: {
    type: String,
    required: true,
  },
});

const quoteText = computed(() => props.quote?.text || "今日摘录同步中。");
const quoteFrom = computed(() => props.quote?.from || "未知来源");
</script>

<style lang="scss" scoped>
.section-heading {
  max-width: 720px;
  margin-bottom: 28px;
}

.section-kicker,
.panel-kicker {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  color: var(--accent-cyan);
  text-transform: uppercase;
}

.section-heading h2,
.panel-head h3 {
  margin: 0;
  font-size: 2rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: 24px;
  align-items: stretch;
}

.quote-panel,
.metric-tile {
  border-radius: var(--radius-panel);
  border: var(--panel-border);
  background: var(--panel-bg);
  box-shadow: var(--shadow-panel);
  min-width: 0;
}

.quote-panel {
  min-height: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.refresh-button {
  min-width: 72px;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.14);
  background: rgb(255 255 255 / 0.04);
  color: var(--text-soft);
  transition:
    transform var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    color var(--duration-fast) ease,
    background-color var(--duration-fast) ease;
}

.refresh-button:hover,
.refresh-button:focus-visible {
  transform: translateY(-1px);
  border-color: rgb(102 231 216 / 0.36);
  color: var(--text-main);
  background: rgb(102 231 216 / 0.08);
}

.quote-text {
  margin: 34px 0 16px;
  font-size: clamp(1.55rem, 2.2vw, 2.35rem);
  line-height: 1.42;
  color: var(--text-main);
  overflow-wrap: anywhere;
}

.quote-from {
  font-size: 1rem;
  color: var(--accent-amber);
}

.quote-dock {
  margin-top: auto;
  padding-top: 34px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.quote-dock div {
  min-height: 86px;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.08);
  background:
    linear-gradient(135deg, rgb(102 231 216 / 0.08), rgb(255 255 255 / 0.025)),
    rgb(255 255 255 / 0.025);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.quote-dock span {
  color: var(--text-soft);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
}

.quote-dock strong {
  color: var(--text-main);
  font-size: 1.02rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.quote-meta {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  span {
    color: var(--text-soft);
    font-size: 0.9rem;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.metric-tile {
  min-height: 144px;
  padding: 18px;
}

.main-tile {
  min-height: 144px;
}

.status-tile {
  background:
    radial-gradient(circle at 88% 18%, rgb(102 231 216 / 0.1), transparent 28%),
    var(--panel-bg);
}

.metric-label {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.metric-value {
  display: block;
  font-size: 2rem;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

.metric-copy {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.7;
  font-size: 0.95rem;
  overflow-wrap: anywhere;
}

.metric-copy.strong {
  color: var(--text-main);
}

.metric-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.metric-percent {
  color: var(--accent-cyan);
  font-size: 0.84rem;
}

.metric-bar {
  margin: 14px 0 12px;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08);
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--accent-cyan), var(--accent-amber));
  }
}

.age-tile {
  grid-column: span 2;
  min-height: 96px;
}

@media (max-width: 1080px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .section-heading h2,
  .panel-head h3 {
    font-size: 1.6rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .age-tile {
    grid-column: auto;
  }

  .quote-text {
    font-size: 1.35rem;
  }

  .quote-dock {
    grid-template-columns: 1fr;
    padding-top: 24px;
  }

  .quote-panel,
  .metric-tile {
    padding: 20px;
  }

  .panel-head {
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
