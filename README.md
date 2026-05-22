# NihongoLofi

Pomodoro timer with live Japanese lofi music from YouTube. Built with Electron.

## Features

- Pomodoro timer — 25 min work / 5 min break, both customizable
- Live lofi stream from YouTube with HLS playback
- Desktop notifications and sound alarm at session end
- Configurable work/break durations, alarms, and stream URL
- Dark glassmorphism UI with frameless window
- Cross-platform: Windows (exe) and Linux (AppImage / AUR)

## Installation

### Arch Linux (AUR)

```bash
yay -S nihongolofi
```

### Linux (AppImage)

Download `NihongoLofi-*.AppImage` from the [releases page](https://github.com/kurojs/NihongoLofi/releases).

```bash
chmod +x NihongoLofi-*.AppImage
./NihongoLofi-*.AppImage
```

Requires `yt-dlp` on your PATH:

```bash
# Arch Linux
sudo pacman -S yt-dlp
# Debian / Ubuntu
sudo apt install yt-dlp
# pip (any distro)
pip install yt-dlp
```

### Windows

Download `NihongoLofi Setup *.exe` from the [releases page](https://github.com/kurojs/NihongoLofi/releases) and run the installer.

yt-dlp is bundled inside the installer — no manual setup needed.

### From Source

Requirements: Node.js >= 18, npm >= 9, yt-dlp.

```bash
git clone https://github.com/kurojs/NihongoLofi.git
cd NihongoLofi
npm install
npm start
```

Build:

```bash
# Windows installer
npm run build

# Linux AppImage
npm run build:linux
```

## Usage

1. Launch the app.
2. Click "Reproducir Stream" to load the lofi stream.
3. Press the pause button to start / pause the Pomodoro timer.
4. Click the gear icon to adjust work/break durations, toggle notifications and alarms, or change the stream URL.
5. Drag the window by the top bar. Use the top-right controls to close, minimize, or maximize.

The timer only counts down while the stream is playing.

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| Work duration | 25 min | Length of each focus session |
| Break duration | 5 min | Length of each break session |
| Notifications | On | Desktop notifications at session end |
| Alarm | On | Sound alert at session end |
| Stream URL | Default lofi stream | Any YouTube video or live URL |

Settings persist between sessions via localStorage.

## Tech Stack

- Electron — cross-platform desktop runtime
- yt-dlp — YouTube stream URL extraction
- hls.js — HLS stream playback
- HTML5 + CSS3 + Vanilla JS

## License

MIT
