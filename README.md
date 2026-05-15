# Personal Signal Home

一个基于 Vue 3 和 Vite 的个人主页。当前版本以“太空入口 + 数字空间”为主视觉，包含入口动画、实时概览、常用链接、音乐控制台、社交入口和 PWA 缓存。

## 功能

- 太空入口页：地球落点、天气/定位状态、进入动画。
- 首页内容流：Hero、当前状态、一言、时间胶囊、常用入口、音乐和联系信息。
- 响应式布局：桌面、平板、手机独立约束，减少文字溢出、错位和横向滚动。
- 失败降级：天气、音乐、图片和字体加载失败时保留稳定 fallback。
- PWA：使用 `vite-plugin-pwa` 自动更新 Service Worker。

## 环境要求

当前依赖使用 Vite 6 和新版 pnpm，建议使用：

```bash
node >= 18.12
pnpm >= 9
```

推荐 Node 20 LTS。Node 16 会导致当前 pnpm 无法启动。

## 本地运行

```bash
pnpm install
pnpm dev
```

默认开发端口是 `3000`。

## 构建和预览

```bash
pnpm build
pnpm preview
```

构建产物输出到 `dist/`。发布前必须确认 `pnpm build` 通过，并用 `pnpm preview` 检查首屏、入口动画、音乐和移动端布局。

## 环境变量

站点基础信息：

```bash
VITE_SITE_NAME="Personal Signal"
VITE_SITE_AUTHOR="Celia"
VITE_SITE_URL="https://example.com"
VITE_SITE_MAIN_LOGO="/images/icon/logo.png"
VITE_SITE_ICP=""
VITE_SITE_START="2024-01-01"
VITE_DESC_TEXT="一个保持在线的数字空间。"
```

天气配置：

```bash
VITE_WEATHER_KEY=""
```

配置高德 Web 服务 Key 后，会使用高德 IP 定位和实时天气。未配置时会使用备用天气接口，入口页落点保留默认坐标并显示备用状态。

音乐配置：

```bash
VITE_SONG_API="https://api-meting.imsyy.top"
VITE_SONG_SERVER="netease"
VITE_SONG_TYPE="playlist"
VITE_SONG_ID="7452421335"
```

音乐接口失败时页面不会空白，音乐面板会显示等待/失败 fallback。

## 内容配置

- 常用链接：编辑 `src/assets/siteLinks.json`。
- 社交链接：编辑 `src/assets/socialLinks.json`。
- 背景图片：编辑 `public/images/background*.jpg`。
- 地球贴图：`public/images/earth-blue-marble-april.jpg`。

## 发布前验收

建议至少检查这些视口：

```text
1440 x 900
1280 x 720
768 x 1024
390 x 844
375 x 667
```

发布标准：

- 首屏无白屏、闪屏和明显背景跳动。
- 入口页进入动画结束后没有遮罩残留。
- Hero、链接、音乐、社交区无重叠、错位、文字溢出。
- 天气接口失败、音乐接口失败、图片加载失败时页面仍稳定。
- 移动端无横向滚动条。
- PWA 更新后刷新页面可以拿到新资源。

## Docker

```bash
docker build -t home .
docker run -p 12445:12445 -d home
```
