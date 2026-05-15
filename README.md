# Celia Island Home

一个基于 React + Vite + animal-island-ui 的个人主页。当前版本采用完整动森风：登岛入口、暖色羊皮纸卡片、自然岛屿背景、NookPhone 风格入口、原生音乐播放器、天气、一言、时间胶囊、社交信息和 PWA 构建。

## 功能

- 登岛入口：轻量 CSS 岛屿地图，无重型 3D、毛玻璃或鼠标 reveal，点击进入更稳定。
- 首页内容流：Hero、实时状态、一言、天气、时间胶囊、常用入口、音乐台和联系方式。
- animal-island-ui：直接引入 `animal-island-ui/style`，使用 `Cursor`、`Button`、`Card`、`Time`、`Tabs`、`Divider`、`Footer`、`Icon`、`Loading`。
- 原生音乐播放器：不再依赖 Vue APlayer，支持歌单加载、播放/暂停、切歌、进度、音量和失败 fallback。
- 响应式布局：桌面、平板、手机都有独立约束，避免横向滚动、文本溢出和卡片错位。
- PWA：使用 `vite-plugin-pwa` 自动更新 Service Worker，并清理过期缓存。

## 致谢

- [imsyy/home](https://github.com/imsyy/home)：本项目的原始主页基础和功能配置来源。
- [guokaigdg/animal-island-ui](https://github.com/guokaigdg/animal-island-ui)：提供当前动森风 UI 组件和视觉基础。

## 环境要求

建议使用 Node 20 LTS。本项目已用 Node `20.20.2` 验证。

```bash
node >= 18.12
pnpm >= 9
```

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

构建产物输出到 `dist/`，该目录不应提交。发布前建议用 `pnpm preview` 检查入口点击、上下滚动、音乐按钮、移动端布局和控制台错误。

## 静态部署

本项目只保留静态部署方式。执行 `pnpm build` 后，将 `dist/` 内的文件上传到静态托管平台或服务器静态目录即可。

部署注意事项：

- 不提交 `dist/` 到仓库。
- 更新后如果浏览器仍显示旧页面，先刷新 Service Worker 或清理站点缓存。
- 服务器需要把未知路由回退到 `index.html`，保证 PWA 和前端路由可正常访问。

## 环境变量

站点基础信息：

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
VITE_DESC_TEXT="一座保持在线的个人小岛。"
```

天气配置：

```bash
VITE_WEATHER_KEY=""
```

配置高德 Web 服务 Key 后，会使用高德 IP 定位和实时天气。未配置或接口失败时，页面会显示“天气同步中”或“岛屿天气暂不可用”，不会出现 `undefined`、`NaN` 或空白面板。

音乐配置：

```bash
VITE_SONG_API="https://api-meting.imsyy.top"
VITE_SONG_SERVER="netease"
VITE_SONG_TYPE="playlist"
VITE_SONG_ID="7452421335"
```

歌单接口失败或配置为空时，音乐面板会显示“歌单暂时无法装载”，控制按钮保持禁用。

## 内容配置

- 常用链接：编辑 `src/assets/siteLinks.json`。
- 社交链接：编辑 `src/assets/socialLinks.json`。
- 图标和头像：放在 `public/images/` 或配置到 `.env`。

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

- 首屏无白屏、闪屏、黑块和明显背景跳动。
- 点击“登岛进入”无明显卡顿，进入后无遮罩残留。
- 常用入口、音乐台、联系方式在桌面和移动端都不重叠、不溢出。
- 天气、一言、音乐接口失败时页面仍保持稳定布局。
- 移动端无横向滚动条。
- PWA 更新后刷新页面可以拿到新资源。
