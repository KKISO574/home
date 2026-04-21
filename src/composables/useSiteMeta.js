import { computed, ref } from "vue";

const normalizeEnv = (value = "") => value.trim().replace(/^["']|["']$/g, "");

const stripProtocol = (value = "") => value.replace(/^https?:\/\//, "").replace(/\/$/, "");

const ensureProtocol = (value = "") => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
};

export const useSiteMeta = () => {
  const siteName = ref(normalizeEnv(import.meta.env.VITE_SITE_NAME || "Personal Signal"));
  const siteAuthor = ref(
    normalizeEnv(import.meta.env.VITE_SITE_AUTHOR || import.meta.env.VITE_SITE_ANTHOR || "Celia"),
  );
  const siteUrl = ref(ensureProtocol(normalizeEnv(import.meta.env.VITE_SITE_URL || "example.com")));
  const siteUrlText = computed(() => stripProtocol(siteUrl.value));
  const siteLogo = ref(
    normalizeEnv(import.meta.env.VITE_SITE_MAIN_LOGO) ||
      normalizeEnv(import.meta.env.VITE_SITE_LOGO) ||
      "/images/icon/logo.png",
  );
  const siteIcp = ref(normalizeEnv(import.meta.env.VITE_SITE_ICP || ""));
  const startDate = ref(normalizeEnv(import.meta.env.VITE_SITE_START || ""));
  const descriptionPrimary = ref(
    normalizeEnv(import.meta.env.VITE_DESC_TEXT || import.meta.env.VITE_SITE_DES || "一个保持在线的数字空间。"),
  );

  return {
    siteName,
    siteAuthor,
    siteUrl,
    siteUrlText,
    siteLogo,
    siteIcp,
    startDate,
    descriptionPrimary,
  };
};
