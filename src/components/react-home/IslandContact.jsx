import { Card, Divider, Icon } from "animal-island-ui";
import socialLinks from "@/assets/socialLinks.json";
import { SafeImage } from "@/components/react-home/SafeImage.jsx";
import { fallbackAvatar } from "@/hooks/useSiteMeta.js";

export const IslandContact = ({ meta, siteAge }) => (
  <section className="island-section contact-section" id="contact">
    <div className="section-container contact-grid">
      <Card className="villager-card" type="title">
        <div className="villager-profile">
          <SafeImage src={meta.siteAvatar} fallbackSrc={fallbackAvatar} alt={`${meta.siteAuthor} avatar`} />
          <div>
            <span className="eyebrow">岛民资料</span>
            <h2>{meta.siteAuthor}</h2>
            <p>{meta.descriptionPrimary}</p>
          </div>
        </div>
        <Divider type="line-brown" />
        <div className="profile-facts">
          <div>
            <span>小岛地址</span>
            <a href={meta.siteUrl} target="_blank" rel="noreferrer">
              {meta.siteUrlText}
            </a>
          </div>
          <div>
            <span>运行时间</span>
            <strong>{siteAge}</strong>
          </div>
          {meta.siteIcp ? (
            <div>
              <span>备案</span>
              <strong>{meta.siteIcp}</strong>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="social-card" type="dashed">
        <div className="section-heading compact">
          <Icon name="icon-chat" size={28} bounce />
          <div>
            <span className="eyebrow">Contact</span>
            <h2>留言入口</h2>
          </div>
        </div>
        <div className="social-list">
          {socialLinks.map((item) => (
            <a
              className="social-item"
              href={item.url}
              target={item.url?.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              key={`${item.name}-${item.url}`}
            >
              <SafeImage src={item.icon} fallbackSrc="/images/icon/github.png" alt="" />
              <div>
                <strong>{item.name}</strong>
                <span>{item.tip}</span>
              </div>
            </a>
          ))}
        </div>
      </Card>
    </div>
  </section>
);
