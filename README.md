# 日本語 - Desktop Application

A minimalist desktop app that combines a Pomodoro timer with live Japanese lofi music from YouTube.

## Features

- 🍅 Pomodoro timer (25 min work / 5 min break, fully customizable)
- 🎵 Live Japanese lofi music streaming via YouTube
- 💖 Custom heart icon with pulse animation
- 🔔 Session start/end desktop notifications
- 🔊 Configurable sound alarm
- ⚙️ Adjustable work and break durations
- 🎨 Dark glassmorphism UI with deep dark tones and subtle blue/purple accents
- 🖥️ Standalone desktop app — no browser needed
- 🪟 Frameless window with frosted glass effect
- 🎮 Minimal SVG window controls (close, minimize, maximize)
- ✨ Smooth animations and fluid transitions

---

## Installation

### Windows

#### From Release (Recommended)

1. Download `NihongoLofi Setup 1.0.0.exe` from the [Releases](../../releases) page
2. Run the installer and follow the setup wizard
3. Launch **日本語** from your desktop or Start Menu
4. Click ▶️ to load the stream and start your session

#### Dependencies

The app requires **yt-dlp** to extract the direct stream URL from YouTube. The binary is bundled inside the installer — no manual setup needed.

> **Note:** If you're running from source (development mode), you must install yt-dlp manually. See [Running from Source](#running-from-source) below.

---

### Linux (AppImage)

#### From Release (Recommended)

1. Download `Nihongo-1.0.0-x86_64.AppImage` from the [Releases](../../releases) page
2. Make it executable:
   ```bash
   chmod +x Nihongo-1.0.0-x86_64.AppImage
   ```
3. Run it:
   ```bash
   ./Nihongo-1.0.0-x86_64.AppImage
   ```

#### Dependencies

- `yt-dlp` must be installed and available in your PATH:
  ```bash
  pip install yt-dlp
  # or
  sudo apt install yt-dlp
  ```
- Internet connection for the YouTube stream

---

## Running from Source

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | ≥ 18.x | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9.x | Comes with Node.js |
| yt-dlp | Latest | See platform instructions below |

### Install yt-dlp

**Windows:**
```powershell
pip install yt-dlp
# The binary will be at:
# C:\Users\<you>\AppData\Roaming\Python\PythonXXX\Scripts\yt-dlp.exe
# Make sure that path is in your system PATH, or copy yt-dlp.exe to bin\yt-dlp.exe inside the project
```

**Linux / macOS:**
```bash
pip install yt-dlp
# or via package manager:
sudo apt install yt-dlp       # Debian/Ubuntu
brew install yt-dlp           # macOS
```

### Setup & Run

```bash
git clone https://github.com/kurojs/NihongoLofi.git
cd NihongoLofi
npm install
npm start
```

### Build

**Windows (.exe installer):**
```bash
npm run build
# Output: dist/日本語 Setup 1.0.0.exe
```

**Linux (AppImage):**
```bash
npm run build:linux
# Output: dist/Nihongo-1.0.0-x86_64.AppImage
```

---

## Usage

1. Launch the **日本語** app
2. A frameless window with transparent blur background will appear showing:
   - 🎥 Live Japanese lofi video stream
   - ⏱️ Pomodoro timer
   - ⚙️ Settings panel (click the gear icon)
3. Click **▶ Reproducir Stream** to load and start the music
4. Press ▶️/⏸️ to start or pause the Pomodoro timer
5. Customize work and break durations in the settings panel
6. Drag the window from the top bar to reposition it
7. Use the top-right buttons to minimize, maximize, or close

> The Pomodoro timer only counts down while the stream is actively playing.

---

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| Work duration | 25 min | Length of each focus session |
| Break duration | 5 min | Length of each break session |
| Notifications | On | Desktop notifications at session end |
| Alarm | On | Sound alert at session end |
| Stream URL | Default lofi stream | Any YouTube video or live URL |

Settings are saved to `localStorage` and persist between sessions.

---

## Design

- **Color palette:** Near-black dark tones (`#0a0a0f` → `#0f0a14`) with subtle blue and purple accents
- **Visual effects:** Glassmorphism with 40px blur, soft shadows, and gradient overlays
- **Typography:** Roboto with color gradient and text-shadow
- **Iconography:** Minimal SVG window controls
- **Interactivity:** Hover states with transforms and glow effects
- **Animations:** Logo pulse, smooth transitions on all interactive elements

---

## Tech Stack

- [Electron](https://www.electronjs.org/) — cross-platform desktop runtime
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) — YouTube stream URL extraction
- [hls.js](https://github.com/video-dev/hls.js/) — HLS stream playback
- HTML5 + CSS3 + Vanilla JavaScript
- [Bootstrap 5.1.1](https://getbootstrap.com/)
- Google Fonts (Roboto)
- Web Notifications API
- localStorage for settings persistence

---

## License

MIT License

---

## Credits

- Lofi music: [YouTube Live Stream](https://www.youtube.com/live/d6f46ZUzJig)
- Heart icon: Custom
- Inspired by the [Lofidoro](https://github.com/jonathanpolina/lofidoro) extension by Jonathan Polina

## Author

[Kuro](https://github.com/kurojs)
