# 📺 DeakhoTV - Ultra HD Live TV & Movie VOD Hub

> A modern, Plex-inspired Live TV & Movie VOD Web Application and Telegram Mini App with 14 customizable color palettes, multi-screen split view, and instant movie scraper engine.

---

## 🌟 Key Features

### 📺 Live TV Streaming & EPG Guide
- **30+ Premium Live Channels**:
  - 🇧🇩 **Bangladeshi**: *Sony AATH HD*, *Jamuna TV HD*, *Independent TV*, *Ekattor TV*, *Shomoy TV*, *NTV*, *ATN News*, *Channel i*.
  - 📰 **World News**: *Al Jazeera English*, *CNN International*, *BBC News*, *TRT World*, *Sky News UK*, *France 24*, *Euronews*, *DW News*, *Bloomberg TV*.
  - ⚽ **Sports HD**: *T-Sports HD*, *CrazeTV Sports*.
  - 🎈 **Kids & Cartoons**: *Cartoon Network HD*, *Tom & Jerry 24/7*, *Duronto TV*, *Boomerang*, *Disney Junior*, *Duck TV*.
  - 🌙 **Religious & Documentary**: *Madina Sunnah Live*, *WildEarth HD*, *Love Nature*, *AccuWeather*.
- **📺 EPG TV Schedule Guide**: Live timeline schedule with progress bars and "Up Next" show indicators.
- **🔄 Auto-Failover Stream Backup**: Automatic HLS stream failover switching to secondary CDN sources when a primary link drops.

### 🎬 Movies & VOD Hub with Instant Scraper
- **100+ Global Masterpiece Movies**: *The Godfather*, *The Shawshank Redemption*, *Pather Panchali*, *Interstellar*, *Inception*, *Spirited Away*, *Monpura*, *Hawa*, *The Matrix*, *Pulp Fiction*, and films from 10+ countries.
- **🔍 Movie Instant Scraper**: Type any movie title worldwide (*Avatar*, *Oppenheimer*, *Spider-Man*, *Pathaan*) to dynamically scrape and generate streaming cards in real time.

### 📺📺 Multi-Screen Split View
- **Dual Screen (2x1)** & **Quad Screen (2x2)**: Watch up to 4 live streams side-by-side with independent audio/video controls.

### 🔞 18+ Adult Alert Protection Mode
- Session-based 18+ Age Verification Modal protecting mature content channels.

### 🎨 Theme Customizer & Water-Drop Animation
- **14 Accent Color Palettes**: *Plex Gold, Neon Blue, Emerald, Violet, Crimson, Cyan, Hot Pink, Sunset Orange, Lime, Indigo, Rose, Ocean Teal, Amber, Slate*.
- **💧 Water-Drop Dark/Light Mode**: Expandable circular clip-path transition on theme toggle.

### ⚙️ Advanced Player & Smart TV Remote Control
- **🔊 200% Audio Booster**: Web Audio API Gain Node boosting low-volume streams up to 250%.
- **⏱️ Live Stream Time-Shift & DVR Rewind**: Rewind/Forward 10s and 1-click **LIVE** sync button.
- **📊 Stream Health "Nerd Stats"**: Real-time monitor displaying Resolution, Bitrate (Mbps), Buffer length, and FPS.
- **📱 Smart TV D-Pad Remote Navigation**:
  - `ArrowLeft` / `ArrowRight`: Previous / Next Channel.
  - `ArrowUp` / `ArrowDown`: Volume Control.
  - `Enter` / `Space`: Play / Pause.
  - `F`: Fullscreen | `P`: PiP | `M`: Mute | `Esc`: Exit.

### 🤖 Telegram Bot & Telegram Mini App Integration
- **Telegram Mini App SDK Integration**: Runs natively inside Telegram with full-screen expansion (`window.Telegram.WebApp`).
- **Telegram Bot Server (`bot.js`)**:
  - `/start`: Mini App Launcher.
  - `/tv`: Category Menu.
  - `/movies`: Movie Catalog.
  - `/search`: Live Chat Search Engine.
  - `/help`: User Guide.
  - Automatic `setMyCommands` & `setChatMenuButton` registration.

---

## 🚀 Quick Start & Local Setup

### 1. Web Application (`deakho-web`)
```bash
# Navigate to web app directory
cd deakho-web

# Install dependencies
npm install

# Start Vite dev server (network accessible)
npm run dev

# Build production bundle
npm run build
```

### 2. Telegram Bot Server (`bot.js`)
```bash
# Run Telegram Bot
node bot.js
```

---

## 🌐 Deploying to Vercel

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Deploy DeakhoTV"
   git push
   ```
2. Import repository on [Vercel](https://vercel.com/):
   - **Root Directory**: `deakho-web`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy**!

---

## 📄 License
MIT License © 2026 DeakhoTV.
