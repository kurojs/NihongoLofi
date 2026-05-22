# 日本語 — NihongoLofi

[![Electron](https://img.shields.io/badge/Electron-22c55e?logo=electron&logoColor=white&labelColor=a855f7)](https://www.electronjs.org/)
[![Arch Linux](https://img.shields.io/badge/Arch_Linux-22c55e?logo=arch-linux&logoColor=white&labelColor=a855f7)](https://archlinux.org/)
[![Windows](https://img.shields.io/badge/Windows-22c55e?logo=windows&logoColor=white&labelColor=a855f7)](https://www.microsoft.com/windows)
[![License: MIT](https://img.shields.io/badge/License-MIT-a855f7?labelColor=22c55e)](https://opensource.org/licenses/MIT)

> Pomodoro timer + live Japanese lofi music — focus, study, relax.

NihongoLofi is a minimalist desktop app that pairs a fully customizable Pomodoro timer with a live Japanese lofi YouTube stream. Built with Electron, styled with dark glassmorphism, and designed for deep focus.

---

## ✨ Features

- ⏱️ **Pomodoro Timer** — 25 min work / 5 min break, both fully customizable
- 🎵 **Live Lofi Stream** — Japanese lofi music via YouTube, HLS playback
- 🔔 **Desktop Notifications** — session start/end alerts with sound
- ⚙️ **Customizable** — adjust durations, toggle alarms & notifications
- 🎨 **Dark Glassmorphism UI** — deep tones, purple accents, fluid animations
- 🪟 **Frameless Window** — frosted glass effect, draggable title bar
- 🖥️ **Cross-Platform** — Windows (exe) & Linux (AppImage / AUR)

---

## 📦 Installation

### 🐧 Arch Linux (AUR)

```bash
# Install yay if you don't have it
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git /tmp/yay
cd /tmp/yay && makepkg -si && cd -

# Install NihongoLofi
yay -S nihongolofi
```

### 🐧 Linux (AppImage)

1. Download `Nihongo-1.0.0-x86_64.AppImage` from the [Releases](../../releases) page
2. Make it executable:

   ```bash
   chmod +x Nihongo-1.0.0-x86_64.AppImage
   ```

3. Run it:

   ```bash
   ./Nihongo-1.0.0-x86_64.AppImage
   ```

#### Linux Dependencies

- `yt-dlp` must be on your PATH:

  ```bash
  # Arch Linux
  sudo pacman -S yt-dlp

  # Debian / Ubuntu
  sudo apt install yt-dlp

  # pip (any distro)
  pip install yt-dlp
  ```

### 🪟 Windows (Installer)

1. Download `NihongoLofi Setup 1.0.0.exe` from the [Releases](../../releases) page
2. Run the installer and follow the setup wizard
3. Launch **日本語** from your desktop or Start Menu

yt-dlp is bundled inside the installer — no manual setup needed.

> ℹ️ Running from source? See [Development](#-development) below.

---

## 🎮 Usage

1. Launch the app — a frameless glass window appears
2. Click **▶ Reproducir Stream** to load the lofi stream
3. Press **⏸️** to start / pause the Pomodoro timer
4. ⚙️ Click the gear icon to tweak work/break durations, notifications, alarms, or stream URL
5. Drag the window by the top bar, use the top-right controls to close / minimize / maximize

> ⏳ The timer only counts down while the stream is actively playing.

---

## ⚙️ Configuration

| Setting         | Default                                                  | Description                       |
| --------------- | -------------------------------------------------------- | --------------------------------- |
| Work duration   | 25 min                                                   | Length of each focus session      |
| Break duration  | 5 min                                                    | Length of each break session      |
| Notifications   | On                                                       | Desktop notifications at session end |
| Alarm           | On                                                       | Sound alert at session end        |
| Stream URL      | [Default lofi stream](https://www.youtube.com/watch?v=d6f46ZUzJig) | Any YouTube video or live URL |

Settings persist between sessions via `localStorage`.

---

## 🛠️ Development

### Prerequisites

| Requirement | Version | Notes                         |
| ----------- | ------- | ----------------------------- |
| Node.js     | ≥ 18.x  | [nodejs.org](https://nodejs.org) |
| npm         | ≥ 9.x   | Comes with Node.js            |
| yt-dlp      | Latest  | See below                     |

### Install yt-dlp

```bash
# Linux / macOS
pip install yt-dlp

# Debian / Ubuntu
sudo apt install yt-dlp

# macOS
brew install yt-dlp
```

### Setup & Run

```bash
git clone https://github.com/kurojs/NihongoLofi.git
cd NihongoLofi
npm install
npm start
```

### Build

```bash
# Windows (exe installer)
npm run build
# → dist/日本語 Setup 1.0.0.exe

# Linux (AppImage)
npm run build:linux
# → dist/Nihongo-1.0.0-x86_64.AppImage
```

---

## 🎨 Design

| Element          | Detail                                              |
| ---------------- | --------------------------------------------------- |
| 🎨 Color palette | Near-black (`#0a0a0f` → `#0f0a14`) + purple accents |
| 💎 Visual style  | Glassmorphism, 40px blur, gradient overlays          |
| 🔤 Typography    | Roboto, weight 400 / 600 / 700                       |
| 🎬 Animations    | Logo pulse, smooth transitions, hover glow           |
| 🖼️ Iconography   | Minimal SVG window controls                          |

---

## 🧱 Tech Stack

- [Electron](https://www.electronjs.org/) — cross-platform desktop runtime
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) — YouTube stream URL extraction
- [hls.js](https://github.com/video-dev/hls.js/) — HLS stream playback
- HTML5 + CSS3 + Vanilla JS
- Web Notifications API + localStorage

---

## 📄 License

MIT — do what you want.

---

## 🙏 Credits

- 🎵 Lofi stream: [YouTube Live](https://www.youtube.com/live/d6f46ZUzJig)
- 💡 Inspired by [Lofidoro](https://github.com/jonathanpolina/lofidoro) by Jonathan Polina

---

<p align="center">
  <sub>Crafted with <a href="https://github.com/kurojs">Kuro</a> · 日本語</sub>
</p>
