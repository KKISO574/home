import { Button, Card, Divider, Icon, Tabs } from "animal-island-ui";

const capsuleColor = {
  day: "app-teal",
  week: "app-green",
  month: "app-yellow",
  year: "warm-peach-pink",
};

export const IslandOverview = ({
  quote,
  quoteLoading,
  onRefreshQuote,
  weatherState,
  weatherLoading,
  onRefreshWeather,
  capsuleList,
  siteAge,
}) => {
  const tabItems = [
    {
      key: "quote",
      label: "摘录",
      children: (
        <div className="overview-tab">
          <p className="quote-text">{quote.text}</p>
          <span className="quote-source">- {quote.from}</span>
        </div>
      ),
    },
    {
      key: "weather",
      label: "天气",
      children: (
        <div className="overview-tab weather-detail">
          <strong>{weatherState.city || "当前位置"}</strong>
          <span>{weatherLoading ? "天气同步中" : weatherState.weather || "岛屿天气暂不可用"}</span>
          <span>
            {weatherState.temperature ? `${weatherState.temperature}°C` : "温度同步中"}
            {weatherState.winddirection ? ` / ${weatherState.winddirection}风` : ""}
          </span>
        </div>
      ),
    },
  ];

  return (
    <section className="island-section" id="overview">
      <div className="section-container">
        <div className="section-heading">
          <Icon name="icon-chat" size={30} bounce />
          <div>
            <span className="eyebrow">今日近况</span>
            <h2>小岛公告板</h2>
          </div>
        </div>

        <div className="overview-grid">
          <Card className="notice-card" type="default">
            <Tabs items={tabItems} defaultActiveKey="quote" />
            <div className="notice-actions">
              <Button
                className="notice-action-button"
                size="middle"
                type="primary"
                icon={<Icon name="icon-chat" size={18} />}
                aria-busy={quoteLoading}
                aria-disabled={quoteLoading}
                onClick={quoteLoading ? undefined : onRefreshQuote}
              >
                刷新摘录
              </Button>
              <Button
                className="notice-action-button"
                size="middle"
                type="primary"
                icon={<Icon name="icon-map" size={18} />}
                aria-busy={weatherLoading}
                aria-disabled={weatherLoading}
                onClick={weatherLoading ? undefined : onRefreshWeather}
              >
                同步天气
              </Button>
            </div>
          </Card>

          <Card className="capsule-card" type="dashed">
            <div className="capsule-head">
              <span>时间胶囊</span>
              <strong>{siteAge}</strong>
            </div>
            <Divider type="line-teal" />
            <div className="capsule-list">
              {capsuleList.map((item) => (
                <Card key={item.key} className="capsule-item" color={capsuleColor[item.key]}>
                  <div className="capsule-name">
                    <span>{item.name}</span>
                    <strong>{Math.round(item.percentage)}%</strong>
                  </div>
                  <div className="progress-track" aria-hidden="true">
                    <span style={{ width: `${Math.min(item.percentage, 100)}%` }} />
                  </div>
                  <p>
                    已过 {item.passed} {item.unit}，还剩 {item.remaining} {item.unit}
                  </p>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
