English | [Chinese](./README.md)

# Celia Island Home

A personal homepage built with React, Vite, and animal-island-ui. The current design uses a full cozy island style: landing gate, warm parchment cards, natural island background, NookPhone-style links, native music player, weather, Hitokoto quote, time capsule, social links, and PWA build output.

## Features

- Island landing gate with lightweight CSS visuals and no heavy 3D, glass blur, or pointer reveal.
- Homepage sections for hero, live status, quote, weather, time capsule, links, music, contact, and footer.
- Direct `animal-island-ui/style` usage with `Cursor`, `Button`, `Card`, `Time`, `Tabs`, `Divider`, `Footer`, `Icon`, and `Loading`.
- Native React audio player for playlist loading, play/pause, previous/next, progress, volume, and failure fallback.
- Responsive layout for desktop, tablet, and mobile with fixed boundaries to avoid overflow and misalignment.
- PWA support through `vite-plugin-pwa` with outdated cache cleanup.

## Requirements

Node 20 LTS is recommended. This project has been verified with Node `20.20.2`.

```bash
node >= 18.12
pnpm >= 9
```

## Local Development

```bash
pnpm install
pnpm dev
```

The default dev port is `3000`.

## Build And Preview

```bash
pnpm build
pnpm preview
```

Build output is written to `dist/`, which should not be committed. Before release, use `pnpm preview` to check gate entry, scrolling, music controls, mobile layout, and console errors.

## Environment Variables

Site metadata:

```bash
VITE_SITE_NAME="Celia小站"
VITE_SITE_AUTHOR="Celia"
VITE_SITE_URL="https://example.com"
VITE_SITE_LOGO="/images/github.png"
VITE_SITE_MAIN_LOGO="/images/icon/logo.png"
VITE_SITE_APPLE_LOGO="/images/icon/apple-touch-icon.png"
VITE_SITE_ICP=""
VITE_SITE_START="2024-01-01"
VITE_DESC_HELLO="Hello Island"
VITE_DESC_TEXT="A personal island that stays online."
```

Weather:

```bash
VITE_WEATHER_KEY=""
```

When an AMap Web Service key is configured, the app uses AMap IP lookup and live weather. If the key is empty or the API fails, the UI keeps a stable fallback instead of rendering `undefined`, `NaN`, or blank panels.

Music:

```bash
VITE_SONG_API="https://api-meting.imsyy.top"
VITE_SONG_SERVER="netease"
VITE_SONG_TYPE="playlist"
VITE_SONG_ID="7452421335"
```

If the playlist API fails or the configuration is empty, the music card shows a clear fallback and disables unavailable controls.

## Content

- Site links: edit `src/assets/siteLinks.json`.
- Social links: edit `src/assets/socialLinks.json`.
- Icons and avatars: place files in `public/images/` or configure them through `.env`.

## Release Checklist

Recommended viewport checks:

```text
1440 x 900
1280 x 720
768 x 1024
390 x 844
375 x 667
```

Release criteria:

- No white screen, flash, black delayed blocks, or obvious background jumping.
- Clicking the gate button enters the homepage without noticeable lag or stale overlay.
- Links, music, and contact sections do not overlap or overflow on desktop or mobile.
- Weather, quote, and music API failures keep a stable layout.
- No horizontal scrollbar on mobile.
- PWA refreshes to the latest assets after updates.

## Docker

```bash
docker build -t home .
docker run -p 12445:12445 -d home
```
