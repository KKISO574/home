import { Button, Card, Divider, Icon, Time } from "animal-island-ui";
import { SafeImage } from "@/components/react-home/SafeImage.jsx";
import { fallbackAvatar } from "@/hooks/useSiteMeta.js";

export const IslandHero = ({ meta, clock, weatherLine, onBackToGate }) => (
  <section className="island-section hero-section" id="top">
    <div className="section-container hero-grid">
      <Card className="hero-card" type="title">
        <div className="hero-logo-row">
          <SafeImage
            className="hero-logo"
            src={meta.siteAvatar}
            fallbackSrc={fallbackAvatar}
            alt={`${meta.siteName} avatar`}
          />
          <div>
            <span className="eyebrow">{meta.hello}</span>
            <h1>{meta.siteName}</h1>
          </div>
        </div>
        <p className="hero-summary">
          {meta.descriptionPrimary} 这里收纳近况、入口、音乐和联系方式。
        </p>
        <div className="hero-actions">
          <Button type="primary" size="large" onClick={() => document.getElementById("links")?.scrollIntoView()}>
            常用入口
          </Button>
          <Button type="default" size="large" onClick={() => document.getElementById("contact")?.scrollIntoView()}>
            联系方式
          </Button>
          <Button type="dashed" size="large" onClick={onBackToGate}>
            返回码头
          </Button>
        </div>
      </Card>

      <Card className="hero-status" color="app-yellow">
        <div className="hero-status-top">
          <Icon name="icon-miles" size={34} bounce />
          <span>Island Log</span>
        </div>
        <Time className="library-time" />
        <Divider type="line-brown" />
        <div className="status-row">
          <span>当前时间</span>
          <strong>{clock.timeLine}</strong>
        </div>
        <div className="status-row">
          <span>今日日期</span>
          <strong>{clock.dateLine}</strong>
        </div>
        <div className="status-row weather-row">
          <span>天气</span>
          <strong>{weatherLine || "岛屿天气同步中"}</strong>
        </div>
      </Card>
    </div>
  </section>
);
