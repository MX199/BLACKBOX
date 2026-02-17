# ⬛ BLACKBOX for BandLab (v1.2.0)
![Banner](https://i.postimg.cc/4349g047/1wctp-GUy.webp)

A stealth utility for BandLab Studio. Designed for creators who need reliability without the clutter.

**[🌐 View on GitHub](https://github.com/MX199/BLACKBOX)**

[![Version](https://img.shields.io/badge/version-v1.2.0-red?style=flat-square&logo=google-chrome)](https://github.com/MX199/BLACKBOX/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)
[![Chrome & Edge Compatible](https://img.shields.io/badge/Browsers-Chrome%20%26%20Edge-success?style=flat-square&logo=google-chrome&logoColor=white)](https://github.com/MX199/BLACKBOX)
[![Tested on Chromium](https://img.shields.io/badge/Tested%20on-All%20Chromium%20Browsers-brightgreen?style=flat-square&logo=chromium&logoColor=white)](https://github.com/MX199/BLACKBOX)
[![GitHub stars](https://img.shields.io/github/stars/MX199/BLACKBOX?style=flat-square&logo=github&color=yellow)](https://github.com/MX199/BLACKBOX/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/MX199/BLACKBOX?style=flat-square&logo=github&color=teal)](https://github.com/MX199/BLACKBOX/network/members)
[![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red?style=flat-square)](https://github.com/MX199/BLACKBOX)

---

## ✨ Features

### Core Protection
- **Pulse Save** — Background auto-save, only triggers when unsaved work is detected.
- **Offline Lock** — Freezes your workspace the moment your internet drops. When you reconnect, a clean "ONLINE" screen confirms you're back.
- **Reconnect Screen** — After going offline, BLACKBOX shows a branded reconnecting screen so you always know your connection status.

### Session Guards 🔒
- **Back Guard** — Blocks browser back navigation when you have unsaved changes.
- **Close Guard** — Warns you before closing or refreshing the tab with unsaved work.

### UI & Branding
- **Custom Notification System** — BandLab's native save notifications are replaced with quiet, BLACKBOX-branded HUD alerts.
- **Stealth Design** — Dark, minimalist interface that stays out of your way.
- **HUD Alerts** — Toggle BLACKBOX's in-studio notifications on or off.

---

## 🖼️ Extension Screenshots

<img width="320" height="602" alt="image" src="https://github.com/user-attachments/assets/8b7abcd8-7867-4772-839d-074462c4ee08" />
<img width="713" height="248" alt="BLACKBOX active indicator" src="https://github.com/user-attachments/assets/09b8e863-4089-43b6-91f6-e65be650f6b1" />
<img width="432" height="91" alt="Settings popup" src="https://github.com/user-attachments/assets/fd8ffb4f-c6bc-4a19-95b3-1ab9474ad38c" />

*The BLACKBOX control panel — clean, simple, and powerful.*

---

## 🚀 Installation

### Option A: CRX Version (Fastest)
1. Download `blackbox.crx` from the [Releases](https://github.com/MX199/BLACKBOX/releases) page.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Drag and drop the `.crx` file into the window.

### Option B: Packed ZIP
1. Download `blackbox-v1.2.0.zip` from Releases.
2. Unzip the folder.
3. Open `chrome://extensions/` → **Load unpacked** → Select the folder.

---

## 🎛️ Features Breakdown

### ⚡ Pulse Save
Automatically syncs your work in the background. Only triggers when the extension detects unsaved changes — smart and efficient.

**Settings:**
- Toggle on/off
- Adjustable sync rate (1–999 seconds)

### 🔒 Offline Lock + Reconnect Screen
When your connection drops, BLACKBOX immediately overlays the studio with a full-screen lock. When you reconnect, it shows a clean green "ONLINE" screen before clearing — so you're never guessing.

### ⬅️ Back Guard
Blocks the browser back button when you have unsaved changes.

**Scenarios this prevents:**
- Accidentally hitting back while working
- Mouse back gesture triggers
- Keyboard shortcut mishaps

### 🚪 Close Guard
Shows a browser confirmation dialog if you try to close or reload the tab with unsaved work.

### 🔔 HUD Alerts
BLACKBOX replaces BandLab's native save notifications with its own minimal HUD. "SESSION SECURED" appears when your work saves. Fully toggleable.

---

## ⚙️ Configuration

| Feature          | Default | Description                              |
|------------------|---------|------------------------------------------|
| **Pulse Save**   | ON      | Auto-save functionality                  |
| **Sync Rate**    | 5s      | How often to check for changes           |
| **Alerts**       | ON      | BLACKBOX HUD notifications               |
| **Offline Guard**| ON      | Freeze screen on disconnect              |
| **Back Guard**   | ON      | Block back button navigation             |
| **Close Guard**  | ON      | Warn before closing tab                  |

---

## 🎯 Usage
1. **Install** the extension using one of the methods above
2. **Open** BandLab Studio (`bandlab.com/studio`)
3. **Look** for the subtle "BLACKBOX ACTIVE" indicator at the bottom center of the page
4. **Customize** settings by clicking the extension icon in your browser toolbar

BLACKBOX runs silently in the background. You'll only see it when it matters.

---

## 🔍 How It Works

BLACKBOX monitors the BandLab Studio interface for unsaved changes by watching the save button state. When it detects changes:
- **Pulse Save** clicks the save button automatically at your configured interval
- **Back Guard** intercepts browser navigation events
- **Close Guard** uses the `beforeunload` API
- **Offline Guard** detects connection loss and locks the UI
- **HUD Alerts** intercepts BandLab's DOM to replace native notifications

All protection only activates when you're actually in the studio with unsaved work.

---

## 💡 Tips

### Optimal Sync Rate
- **Fast editing**: 3–5 seconds
- **Normal workflow**: 5–10 seconds
- **Minimal interruption**: 15–30 seconds

### Session Guards
- Back Guard only blocks when you have unsaved changes
- Close Guard uses native browser dialogs
- Both are non-intrusive until you actually need them

---

## 🆘 Troubleshooting

### Extension not working?
- Make sure you're on `bandlab.com`
- Look for the "BLACKBOX ACTIVE" indicator at the bottom of the studio
- Check browser console (F12) for `[BLACKBOX]` messages

### Guards not blocking?
- Session guards only activate with unsaved changes
- Make sure they're enabled in the popup
- Reload BandLab after changing settings

### HUD notifications not showing?
- Make sure **Alerts** is toggled ON in the popup
- BandLab must show its own save notification for BLACKBOX to intercept it

---

## 📋 Requirements
- **Browser**: Chrome, Edge, Brave, Opera, or any Chromium-based browser
- **OS**: Windows, macOS, Linux
- **Platform**: BandLab Studio (bandlab.com)

---

## 🔐 Privacy & Security
BLACKBOX:
- ✅ Only runs on bandlab.com
- ✅ Stores settings locally on your device
- ✅ No data collection or tracking
- ✅ No external servers or API calls
- ✅ Open source — review the code yourself

---

## 🚧 Known Limitations
- Session guards require JavaScript to be enabled
- Some browser shortcuts may override Close Guard
- Works best with native Chromium browsers

---

## 📝 Changelog

### v1.2.0 (Latest)
- ✨ **NEW:** BLACKBOX branded loading screen on Studio open
- ✨ **NEW:** Custom HUD notification system — replaces BandLab's native save toasts
- ✨ **NEW:** Reconnecting screen when coming back online after Offline Lock
- ✨ **NEW:** HUD Alerts toggle in settings
- ⚡ Streamlined save logic — no more verification polling
- 🎨 Improved stealth branding throughout

### v1.1.0
- ✨ **NEW:** Back Guard — prevents accidental back navigation
- ✨ **NEW:** Close Guard — warns before closing tab with unsaved work
- 🔧 Fixed CSP violations
- ⚡ Optimized with debouncing and rate limiting

### v1.0.0
- Initial release
- Pulse Save
- Offline Guard
- Stealth UI

---

## 🛠️ Development
Want to contribute or modify BLACKBOX? All code is documented with JSDoc comments.

---

## 📞 Support
- 🐛 **Bug reports**: [GitHub Issues](https://github.com/MX199/BLACKBOX/issues)
- 💬 **Questions**: [Reddit thread](https://www.reddit.com/r/Bandlab/comments/1r48uly/never_lose_a_bandlab_track_again_armor_pro_v433/)
- ⭐ **Like it?** Star the repo!

---

## 📄 License
MIT License — feel free to use, modify, and distribute.

---

*made by mx | v1.2.0*
**Built for creators, by a creator. 🎹🔥**
