<template>
  <section id="live" class="section-shell">
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
            <button class="refresh-button" type="button" @click="$emit('refresh-quote')">
              刷新
            </button>
          </div>

          <p class="quote-text">{{ quote.text }}</p>
          <p class="quote-from">- {{ quote.from }}</p>

          <div class="quote-meta">
            <span>{{ dateLine }}</span>
            <span>{{ weatherLine || "天气数据更新中" }}</span>
          </div>
        </article>

        <div class="metrics-grid">
          <article class="metric-tile main-tile">
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
defineEmits(["refresh-quote"]);

defineProps({
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
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 24px;
}

.quote-panel,
.metric-tile {
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.08), rgb(255 255 255 / 0.02)),
    rgb(9 15 24 / 0.72);
  box-shadow: 0 18px 48px rgb(0 0 0 / 0.28);
  backdrop-filter: blur(18px);
}

.quote-panel {
  min-height: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
}

.quote-text {
  margin: 34px 0 16px;
  font-size: 1.7rem;
  line-height: 1.45;
  color: var(--text-main);
}

.quote-from {
  font-size: 1rem;
  color: var(--accent-amber);
}

.quote-meta {
  margin-top: 28px;
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
  min-height: 148px;
  padding: 18px;
}

.main-tile {
  min-height: 164px;
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
}

.metric-copy {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.7;
  font-size: 0.95rem;
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
  min-height: auto;
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
}
</style>
