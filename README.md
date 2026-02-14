# ⬛ BLACKBOX for BandLab (v1.1.0)

![Banner](https://i.postimg.cc/4349g047/1wctp-GUy.webp)

A stealth utility for BandLab Studio. Designed for creators who need reliability without the clutter.

**[🌐 View on GitHub](https://github.com/MX199/BLACKBOX)**

---

## ✨ Features

### Core Protection
*   **Pulse Save**: Background backup only when unsaved work is detected.
*   **Offline Lock**: Freezes your workspace if your internet disconnects to prevent unsaved edits.

### NEW: Session Guards 🔒
*   **Back Guard**: Prevents accidental back navigation when you have unsaved changes. Keeps you in the studio.
*   **Close Guard**: Warns you before closing or refreshing the tab if you have unsaved work.

### UI
*   **Stealth Design**: Dark, minimalist interface that doesn't get in your way.

---

## 🖼️ Extension Screenshots

<img width="325" height="563" alt="image" src="https://github.com/user-attachments/assets/c56eeb07-588a-436c-8cab-10574151dd84" />
<img width="713" height="248" alt="image_2026-02-15_015813777" src="https://github.com/user-attachments/assets/09b8e863-4089-43b6-91f6-e65be650f6b1" />
<img width="432" height="91" alt="image" src="https://github.com/user-attachments/assets/fd8ffb4f-c6bc-4a19-95b3-1ab9474ad38c" />


*The BLACKBOX control panel - clean, simple, and powerful.*

---

## 🚀 Installation

### Option A: CRX Version (Fastest)
1. Download `blackbox.crx` from the [Releases](https://github.com/MX199/BLACKBOX/releases) page.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Drag and drop the `.crx` file into the window.

### Option B: Packed ZIP
1. Download `blackbox-v1.1.0.zip` from Releases.
2. Unzip the folder.
3. Open `chrome://extensions/` → **Load unpacked** → Select the folder.

---

## 🎛️ Features Breakdown

### ⚡ Pulse Save
Automatically syncs your work in the background. Only triggers when the extension detects you've made changes - smart and bandwidth-efficient.

**Settings:**
- Toggle on/off
- Adjustable sync rate (1-999 seconds)

### 🔒 Offline Lock
When your internet connection drops, BLACKBOX immediately freezes the entire studio interface with a full-screen overlay. This prevents you from continuing to work on a session that can't be saved.

**Why this matters:** Without this, you might keep working for minutes without realizing you're offline, then lose everything when you try to sync.

### ⬅️ Back Guard (NEW)
Blocks the browser back button when you have unsaved changes. Instead of navigating away, you'll see a warning popup.

**Scenarios this prevents:**
- Accidentally hitting back while working
- Mouse gesture triggers
- Keyboard shortcut mishaps

### 🚪 Close Guard (NEW)
Shows a browser confirmation dialog if you try to close or reload the tab with unsaved work.

**Protection against:**
- Accidentally closing the tab
- Hitting Ctrl+W by mistake
- Browser crashes without warning

---

## ⚙️ Configuration

All features can be toggled on/off from the extension popup:

| Feature | Default | Description |
|---------|---------|-------------|
| **Pulse Save** | ON | Auto-save functionality |
| **Sync Rate** | 5s | How often to check for changes |
| **Offline Guard** | ON | Freeze screen on disconnect |
| **Back Guard** | ON | Block back button navigation |
| **Close Guard** | ON | Warn before closing tab |

---

## 🎯 Usage

1. **Install** the extension using one of the methods above
2. **Open** BandLab Studio (`bandlab.com/studio`)
3. **Look** for the subtle "BLACKBOX ACTIVE" indicator at the bottom center of the page
4. **Customize** settings by clicking the extension icon in your browser toolbar

That's it! BLACKBOX runs silently in the background, protecting your work.

---

## 🔍 How It Works

BLACKBOX monitors the BandLab Studio interface for unsaved changes by watching the save button state. When it detects changes:

- **Pulse Save** clicks the save button automatically at your configured interval
- **Back Guard** intercepts browser navigation events
- **Close Guard** uses the beforeunload API to warn you
- **Offline Guard** detects connection loss and locks the UI

All protection features only activate when you're actually in the studio with unsaved work.

---

## 💡 Tips

### Optimal Settings
- **Fast editing**: 3-5 second sync rate
- **Normal workflow**: 5-10 seconds
- **Minimal interruption**: 15-30 seconds

### Session Guards
- **Back Guard** only blocks when you have unsaved changes - it won't prevent normal navigation
- **Close Guard** uses native browser dialogs - no custom popups
- Both guards are non-intrusive until you actually need them

---

## 🆘 Troubleshooting

### Extension not working?
- Make sure you're on `bandlab.com` (check permissions)
- Look for the "BLACKBOX ACTIVE" indicator at the bottom of the page
- Check browser console (F12) for `[BLACKBOX]` messages

### Guards not blocking?
- Session guards only work when you have unsaved changes
- Make sure they're enabled in the extension popup
- Reload the BandLab page after changing settings

### Auto-save not triggering?
- Verify you're in the Studio (URL contains `/studio`)
- Check that save button is actually clickable (has unsaved changes)
- Look for console messages confirming saves

---

## 📋 Requirements

- **Browser**: Chrome, Edge, or any Chromium-based browser
- **OS**: Windows, macOS, Linux
- **Platform**: BandLab Studio (bandlab.com)

---

## 🔐 Privacy & Security

BLACKBOX:
- ✅ Only runs on bandlab.com
- ✅ Stores settings locally on your device
- ✅ No data collection or tracking
- ✅ No external servers or API calls
- ✅ Open source - review the code yourself

---

## 🚧 Known Limitations

- Session guards require JavaScript to be enabled
- Some browser shortcuts might override Close Guard
- Works best with Chrome/Edge (native Chromium browsers)

---

## 📝 Changelog

### v1.1.0 (Latest)
- ✨ **NEW:** Back Guard - prevents accidental back navigation
- ✨ **NEW:** Close Guard - warns before closing tab with unsaved work
- 🔧 Fixed CSP violations for better browser compliance
- ⚡ Optimized performance with debouncing and rate limiting
- 📚 Comprehensive code documentation

### v1.0.0
- Initial release
- Pulse Save functionality
- Offline Guard
- Stealth UI

---

## 🛠️ Development

Want to contribute or modify BLACKBOX?
All code is documented with JSDoc comments.

---

## 📞 Support

- 🐛 **Bug reports**: [GitHub Issues](https://github.com/MX199/BLACKBOX/issues)
- 💬 **Questions**: [reddit](https://www.reddit.com/r/Bandlab/comments/1r48uly/never_lose_a_bandlab_track_again_armor_pro_v433/)
- ⭐ **Like it?** Star the repo!

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

---

*made by mx | v1.1.0*

**Built for creators, by a creator. 🎹🔥**
