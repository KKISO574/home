import { useMemo } from "react";

const normalizeEnv = (value = "") => String(value).trim().replace(/^["']|["']$/g, "");

const stripProtocol = (value = "") => value.replace(/^https?:\/\//, "").replace(/\/$/, "");

const ensureProtocol = (value = "") => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
};

export const useSiteMeta = () =>
  useMemo(() => {
    const siteName = normalizeEnv(import.meta.env.VITE_SITE_NAME || "Celia Island");
    const siteAuthor = normalizeEnv(
      import.meta.env.VITE_SITE_AUTHOR || import.meta.env.VITE_SITE_ANTHOR || "Celia",
    );
    const siteUrl = ensureProtocol(normalizeEnv(import.meta.env.VITE_SITE_URL || "example.com"));
    const siteLogo =
      normalizeEnv(import.meta.env.VITE_SITE_MAIN_LOGO) ||
      normalizeEnv(import.meta.env.VITE_SITE_LOGO) ||
      "/images/icon/logo.png";
    const descriptionPrimary = normalizeEnv(
      import.meta.env.VITE_DESC_TEXT ||
        import.meta.env.VITE_SITE_DES ||
        "一座保持在线的个人小岛。",
    );

    return {
      siteName,
      siteAuthor,
      siteUrl,
      siteUrlText: stripProtocol(siteUrl),
      siteLogo,
      siteIcp: normalizeEnv(import.meta.env.VITE_SITE_ICP || ""),
      startDate: normalizeEnv(import.meta.env.VITE_SITE_START || ""),
      descriptionPrimary,
      hello: normalizeEnv(import.meta.env.VITE_DESC_HELLO || "Hello Island"),
    };
  }, []);
