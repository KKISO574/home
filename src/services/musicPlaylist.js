import { getPlayerList } from "@/api";

export const MUSIC_CACHE_MAX_AGE = 1000 * 60 * 60 * 12;

const inFlightRequests = new Map();
const memoryPlaylists = new Map();

const normalizeEnv = (value = "") => String(value).trim().replace(/^["']|["']$/g, "");

export const getMusicConfig = () => ({
  api: normalizeEnv(import.meta.env.VITE_SONG_API),
  server: normalizeEnv(import.meta.env.VITE_SONG_SERVER),
  type: normalizeEnv(import.meta.env.VITE_SONG_TYPE),
  id: normalizeEnv(import.meta.env.VITE_SONG_ID),
});

export const hasMusicConfig = ({ api, server, type, id } = getMusicConfig()) =>
  Boolean(api && server && type && id);

export const getPlaylistCacheKey = ({ api, server, type, id }) =>
  `home:music:${api}:${server}:${type}:${id}`;

export const normalizePlaylist = (result) =>
  Array.isArray(result)
    ? result
        .filter((track) => track?.url)
        .map((track) => ({
          name: track.name || "未命名歌曲",
          artist: track.artist || "Unknown Artist",
          url: track.url,
          cover: track.cover || "",
          lrc: track.lrc,
        }))
        .slice(0, 50)
    : [];

const toCacheEntry = (payload) => {
  const playlist = normalizePlaylist(payload?.playlist);
  if (!playlist.length) return null;

  return {
    isFresh: Date.now() - Number(payload.updatedAt || 0) < MUSIC_CACHE_MAX_AGE,
    playlist,
    updatedAt: Number(payload.updatedAt || 0),
  };
};

const readStorage = (cacheKey) => {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage.getItem(cacheKey);
};

export const readPlaylistCache = (cacheKey) => {
  const memoryEntry = toCacheEntry(memoryPlaylists.get(cacheKey));
  if (memoryEntry?.isFresh) return memoryEntry;

  try {
    const cached = readStorage(cacheKey);
    if (!cached) return memoryEntry;

    const storageEntry = toCacheEntry(JSON.parse(cached));
    return storageEntry || memoryEntry;
  } catch {
    return memoryEntry;
  }
};

export const writePlaylistCache = (cacheKey, playlist) => {
  const payload = {
    playlist,
    updatedAt: Date.now(),
  };

  memoryPlaylists.set(cacheKey, payload);

  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch {
    // Storage can be unavailable in private mode; the player still works without cache.
  }
};

const addConnectionHint = (apiUrl) => {
  if (typeof document === "undefined" || !apiUrl) return;

  try {
    const origin = new URL(apiUrl, window.location.href).origin;
    const existing = document.head.querySelector(`link[data-music-origin="${origin}"]`);
    if (existing) return;

    const dns = document.createElement("link");
    dns.rel = "dns-prefetch";
    dns.href = origin;
    dns.dataset.musicOrigin = origin;
    document.head.appendChild(dns);

    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = origin;
    preconnect.crossOrigin = "anonymous";
    preconnect.dataset.musicOrigin = origin;
    document.head.appendChild(preconnect);
  } catch {
    // Invalid URLs should not block the page.
  }
};

export const requestPlaylist = (config = getMusicConfig()) => {
  if (!hasMusicConfig(config)) {
    return Promise.reject(new Error("music config missing"));
  }

  const cacheKey = getPlaylistCacheKey(config);
  const cachedRequest = inFlightRequests.get(cacheKey);
  if (cachedRequest) return cachedRequest;

  addConnectionHint(config.api);

  const request = getPlayerList(config.server, config.type, config.id, config.api)
    .then((result) => {
      const playlist = normalizePlaylist(result);
      if (playlist.length) {
        writePlaylistCache(cacheKey, playlist);
      }
      return playlist;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, request);
  return request;
};

export const warmPlaylistCache = () => {
  const config = getMusicConfig();
  if (!hasMusicConfig(config)) return Promise.resolve([]);

  addConnectionHint(config.api);

  const cacheKey = getPlaylistCacheKey(config);
  const cached = readPlaylistCache(cacheKey);
  if (cached?.isFresh) return Promise.resolve(cached.playlist);

  return requestPlaylist(config).catch(() => cached?.playlist || []);
};
