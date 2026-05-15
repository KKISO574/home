import { Card, Icon } from "animal-island-ui";
import siteLinks from "@/assets/siteLinks.json";

const iconMap = ["icon-map", "icon-shopping", "icon-diy", "icon-camera", "icon-critterpedia", "icon-helicopter"];
const colorMap = ["app-green", "app-yellow", "app-teal", "app-pink", "app-blue", "warm-peach-pink"];

export const IslandLinks = () => (
  <section className="island-section" id="links">
    <div className="section-container">
      <div className="section-heading">
        <Icon name="icon-shopping" size={30} bounce />
        <div>
          <span className="eyebrow">NookPhone</span>
          <h2>常用入口</h2>
        </div>
      </div>

      <div className="phone-grid" aria-label="常用站点链接">
        {siteLinks.map((item, index) => (
          <a
            className="phone-app-link"
            key={`${item.name}-${item.link}`}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            title={item.name}
          >
            <Card className="phone-app" color={colorMap[index % colorMap.length]}>
              <span className="app-icon-bubble">
                <Icon name={iconMap[index % iconMap.length]} size={42} bounce />
              </span>
              <strong>{item.name}</strong>
            </Card>
          </a>
        ))}
      </div>
    </div>
  </section>
);
