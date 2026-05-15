import { Button, Card, Divider, Icon } from "animal-island-ui";

const markerText = (locationState) => {
  const latitude = Number(locationState?.latitude);
  const longitude = Number(locationState?.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return "坐标同步中";
  return `${latitude.toFixed(2)}N / ${longitude.toFixed(2)}E`;
};

export const IslandGate = ({ siteName, siteAuthor, weatherLine, locationState, onEnter }) => (
  <section className="gate-screen" aria-label="登岛入口">
    <div className="leaf-field" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>

    <div className="gate-layout">
      <div className="island-map" aria-hidden="true">
        <div className="island-blob">
          <div className="pond" />
          <div className="house house-a" />
          <div className="house house-b" />
          <div className="tree tree-a" />
          <div className="tree tree-b" />
          <div className="tree tree-c" />
          <div className="path-line" />
        </div>
      </div>

      <Card className="gate-card" type="title">
        <div className="gate-kicker">
          <Icon name="icon-map" size={30} bounce />
          <span>{siteAuthor} 的小岛</span>
        </div>
        <h1>{siteName}</h1>
        <p>风已经吹到码头，今天的小岛可以进入了。</p>
        <Divider type="wave-yellow" />
        <div className="gate-meta">
          <span>{weatherLine || "岛屿天气同步中"}</span>
          <span>{markerText(locationState)}</span>
        </div>
        <Button className="gate-enter" type="primary" size="large" onClick={onEnter}>
          登岛进入
        </Button>
      </Card>
    </div>
  </section>
);
