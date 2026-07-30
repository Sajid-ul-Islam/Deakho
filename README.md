# 📺 DeakhoTV Ultimate Edition - Ultra HD Live TV, Movies & Universal Media Player

> A modern, state-of-the-art Live IPTV & Movie VOD Web Application and Telegram Mini App featuring YouTube-style mobile UI/UX, 100% edge-to-edge video scaling, 2x daily automated stream scraping CI/CD pipelines, universal local & network media playback, MediaSession background audio, and liquid water-drop theme transitions.

---

## 🌟 Key Features & Highlights

### 📺 Live TV Streaming & Peace TV Network
- **40+ Premium Live Channels**:
  - 🇧🇩 **Bangladeshi**: *Sony AATH HD*, *Jamuna TV HD*, *Independent TV*, *Ekattor TV*, *Shomoy TV*, *BTV*, *Deepto TV*, *Ekusey TV*, *NTV*, *ATN News*, *Channel i*.
  - 🌙 **Religious & Peace TV**: *Peace TV Bangla HD*, *Peace TV English HD*, *Peace TV Urdu HD*, *Peace TV Chinese HD*, *Saudi Quran Live*, *Madina Sunnah Live*.
  - 📰 **World News**: *Al Jazeera English*, *CNN International*, *BBC News*, *TRT World*, *Sky News UK*, *France 24*, *DW News*, *Bloomberg TV*.
  - ⚽ **Sports HD**: *T-Sports HD*, *CrazeTV Sports*.
  - 🎈 **Kids & Cartoons**: *Tom & Jerry 24/7*, *Duronto TV*, *Boomerang*, *Disney Junior*, *Duck TV*, *Jungle Book TV*, *PBS Kids*, *Rongeen TV*.
- **📺 EPG TV Schedule Guide**: Full scrollable live timeline schedule displaying program progress bars and "Up Next" show indicators.
- **🔄 Auto-Failover Stream Engine**: Transparent HLS stream failover switching to backup CDN sources when a primary link drops.

### 📱 YouTube-Style Mobile UI/UX & Slide-Type Suggestion Chips
- **YouTube Cinema Layout**:
  - Verified Channel Header with verified badge (`✓`), live watcher counter (`1.4K Watching Live`), and interactive **Subscribe / Favorite (`⭐ Favorite` / `⭐ Saved`)** button.
  - Action Pill Bar (`👍 Like`, `🔗 Share`, `⏭️ Next Stream`, `⚡ 1080p HD`).
  - **Slide-Type Suggestion Chips Carousel**: Swipeable horizontal filter pills (`All`, `Up Next`, `Bangladeshi`, `News`, `Sports`, `Entertainment`, `Kids`, `Religious`).
  - **100% Edge-to-Edge Mobile Video Scaling**: Video player scales flush against phone screen edges with 0 side margins.
  - **Horizontal Swipable Recommendation Cards (`snap-x`)** on mobile & vertical "Up Next" sidebar on desktop.

### 📌 Scroll-Aware Floating Sticky Mini-Player
- Automatic `IntersectionObserver` that transforms active streams into a floating picture-in-picture mini-player when scrolling down the page.
- Floats at `bottom: 4.5rem right: 0.75rem` on mobile view to avoid top header collisions.

### 🎬 Universal Local & Network Media Player
- **📁 Local File Upload**: Drag & drop or select local media files (`MP4`, `MKV`, `WebM`, `MP3`, `AAC`, `FLAC`, `WAV`).
- **🌐 Network Stream URL**: Stream network video files or live `.m3u8` playlists.
- **📻 MediaSession API (Background Audio Playback)**: Audio continues playing seamlessly when the browser tab or mobile app is minimized, with OS notification shade & lockscreen controls.
- **🖼️ System Picture-in-Picture & Auto-Minimize**: 1-click floating video screen + Web Page Visibility API auto-PiP on tab minimize.

### 💧 Actual Liquid Water Droplet Theme Transition
- Teardrop droplet falls from click coordinates `(x, y)` and impacts with a liquid splash wave across 14 theme accent colors.

### 🤖 2x Daily GitHub Actions CI/CD Auto-Scraper Pipeline
- **[auto-scraper-cicd.yml](.github/workflows/auto-scraper-cicd.yml)**: Scrapes active IPTV streams 2 times daily (00:00 & 12:00 UTC) and commits updated streams to GitHub.
- **[health-check.yml](.github/workflows/health-check.yml)**: Daily link health audit & uptime reporting.
- **[deploy-worker.yml](.github/workflows/deploy-worker.yml)**: Automated Cloudflare Worker CORS proxy deployment.

---

## 🚀 Quick Start & Local Setup

### 1. Web Application (`deakho-web`)
```bash
# Navigate to web app directory
cd deakho-web

# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run automated stream scraper
npm run scrape

# Verify types & code quality
npm run typecheck
npm run lint

# Build production bundle
npm run build
```

### 2. Telegram Bot Server (`bot.js`)
```bash
# Run Telegram Bot
node bot.js
```

---

## 📄 License
MIT License © 2026 DeakhoTV.
