# Gemini Side Panel
![banner](https://github.com/sujit-waghmare/gemini-side-panel/blob/1bea5ba6a779ccf0654f935e1b365a5e235bb3c2/assets/images/Gemini-side-panel-banner%5Bv1.4.0%5D.png)

[![GitHub release](https://img.shields.io/github/v/release/sujit-waghmare/gemini-side-panel?color=blue&style=flat-square)](https://github.com/sujit-waghmare/gemini-side-panel/releases)
[![Obsidian](https://img.shields.io/badge/Obsidian-v0.15.0+-purple?style=flat-square)](https://obsidian.md)
[![License](https://img.shields.io/github/license/sujit-waghmare/gemini-side-panel?style=flat-square)](LICENSE)
[![Mobile](https://img.shields.io/badge/Mobile-Supported-green?style=flat-square)](https://obsidian.md/mobile)
<p align="center">
A side-panel Gemini chat for Obsidian with note-specific history, temperature control, custom template referencing, and Sarvam AI voice transcription.
</p>

---

## ✨ Features

- **Side Panel Chat** — Opens in the left or right panel via ribbon icon or Command Palette
- **Note-Specific History** — Each note has its own chat history, auto-cleared by days or query count
- **Model Selector** — Switch between Gemini 3.1 Pro, 3 Flash, 2.5 Pro, 2.5 Flash, and more
- **Source Toggle** — `Note` mode (strict context only) or `Internet` mode (general knowledge)
- **Format Options** — Better Visuals, Better Understanding, or Brief Information
- **Template Engine** — Map your own `.md` files as response templates; Gemini mirrors their exact structure
- **Voice Input** — Hold the mic button to record, release to transcribe via Sarvam AI (English + 11 Indic languages)
- **LaTeX Support** — Renders `$inline$` and `$$block$$` math automatically
- **Hold to Copy** — Long-press any response bubble for 600ms to copy its contents
- **Theme Sync** — Inherits your Obsidian accent colors automatically
- **Mobile Friendly** — Works on both desktop and mobile

---

## 🆕 What's New in v1.4.0

- **Sarvam AI Voice Transcription** — Hold 🎤 to record, release to send transcript to input. Uses `saaras:v3` — auto-detects English, Hindi, and 10 other Indic languages with no extra config.
- **Voice button** appears automatically once a Sarvam API key is added in settings; hidden otherwise.
- **TDZ fix** — corrected a crash in the settings temperature slider on some Obsidian versions.

---

## 📦 Installation

### Manual (Current Method)

1. Download `main.js`, `styles.css`, and `manifest.json` from the [latest release](https://github.com/sujit-waghmare/gemini-side-panel/releases).
2. In your vault, navigate to `.obsidian/plugins/`.
3. Create a folder named exactly: `gemini-side-panel`.
4. Place the three files inside it.
5. Open Obsidian → **Settings → Community Plugins** → click **Refresh**.
6. Find **Gemini Side Panel** and toggle it **ON**.

### Folder Structure

```
YourVault/
└── .obsidian/
    └── plugins/
        └── gemini-side-panel/
            ├── main.js
            ├── styles.css
            └── manifest.json
```

---

## ⚙️ Setup

Go to **Settings → Gemini Side Panel** and configure:

### API Configuration
- **Gemini API Key** — Get yours free from [Google AI Studio](https://aistudio.google.com/). Required.
- **Model** — Choose from Gemini 3.1 Pro, 3 Flash, 2.5 Pro, 2.5 Flash, and more.

### Voice Transcription
- **Sarvam API Key** — Get yours free from [dashboard.sarvam.ai](https://dashboard.sarvam.ai). Optional. Enables the 🎤 button.
- Supports **English, Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Odia** — auto-detected from audio.

### AI Behavior
- **Temperature** — Slider from `0.5` to `1.0`.
  - `1.0` = Sticks strictly to your selected source
  - `0.5` = Looser, reference-based answers

### History Settings
- **Enable Chat History** — Off by default. Toggle on to persist chats per note.
- **Retention Limit** — Choose `Days` or `Queries`.
- **Limit Value** — Number of days or query pairs to retain.

### Template Configuration
- **Add Template** — Assign a display name and a vault file path (e.g. `Templates/Physics.md`).
- `.md` is auto-appended if omitted.
- Selected templates override standard format options.

---

## 💬 Usage

### Opening the Panel

| Method | Action |
|---|---|
| Ribbon icon | Click the **bot** icon in the left ribbon |
| Command Palette | `Open Gemini in right panel` / `Open Gemini in left panel` |
| Selection Mode | Highlight text → run open command → text pre-fills the input |

### Chat Controls

| Control | Action |
|---|---|
| **Send** button | Sends your message |
| 🎤 **Voice** button | Hold to record, release to transcribe |
| **Menu** icon | Opens the floating dropdown |
| Long-press bubble | Hold 600ms to copy response |
| `Clear Gemini chat history` command | Clears history for the active note only |

### Dropdown Menu
- **Model** — Switch Gemini model (collapsed by default)
- **Source** — `Note` (strict) or `Internet` (general)
- **Format** — Visuals / Understanding / Brief
- **Templates** — Select a custom template to override format

### Quick Reference

| What you want | How to do it |
|---|---|
| Open Panel | Ribbon icon or Command Palette |
| Toggle Source | Menu → Source → Note / Internet |
| Force Template | Menu → Templates → Select your template |
| Voice Input | Hold 🎤, speak, release |
| Copy Response | Long-press the chat bubble |
| Reset Note Chat | Command: `Clear Gemini chat history` |
| Adjust Strictness | Settings → Temperature Slider |

---

## 🧪 Testing

1. **Template Override** — Select a custom template; Format should auto-clear. Send a prompt and verify the AI mirrors the template structure.
2. **Note History** — Chat on Note A, switch to Note B (chat should be empty), switch back (chat should restore).
3. **Invalid Template** — Set a fake path in settings, select it, send a message. The bot should respond with a `⚠️ Error` immediately without calling the API.
4. **Voice Input** — Add a Sarvam key, hold 🎤, speak a sentence, release. Transcript should appear in the input field with a language notice.

---

## ❌ Troubleshooting

| Problem | Solution |
|---|---|
| `API Key missing!` | Go to settings, paste key without trailing spaces |
| `Could not find template file` | Check Template Configuration; path is case-sensitive |
| `Failed to load plugin` | Ensure `main.js` has no syntax errors; check `data.json` in the plugin folder |
| `Connection failed` | Check internet connection; retry |
| 🎤 button not showing | Add a Sarvam API key in Settings → Voice Transcription |
| `Mic access denied` | Allow microphone permission in your OS/browser settings |
| `Sarvam error 422` | Audio too long (>30s) or unsupported format; try again with a shorter clip |

---

## ❓ FAQ

<details>
<summary><strong>Q: Is the voice transcription free?</strong></summary>
Yes. Sarvam AI provides a free tier. You just need to create an account and generate a key at dashboard.sarvam.ai.
</details>

<details>
<summary><strong>Q: Why don't I see the microphone button?</strong></summary>
The button remains hidden until you paste a valid Sarvam API Key in the plugin settings. Once added, the button will appear next to the Send button.
</details>

<details>
<summary><strong>Q: Will Gemini always follow my template structure?</strong></summary>
It strongly enforces it via a CRITICAL RULE prompt. Setting temperature to 1.0 improves compliance.
</details>

<details>
<summary><strong>Q: Does the plugin send my notes to Google?</strong></summary>
Only when Source is set to Note and you send a message. No data is stored externally by the plugin itself.
</details>

<details>
<summary><strong>Q: Where is chat history stored?</strong></summary>
Locally inside your vault, in .obsidian/plugins/gemini-side-panel/data.json.
</details>

---

## 💡 Pro Tips

- **Clear Chat** — Use the `Clear Gemini chat history` command to wipe only the active note's history.
- **Theme Sync** — Bubbles and menus use `--interactive-accent`, so they match any Obsidian theme.
- **Selection Mode** — Highlight a paragraph and open the panel; the selection pre-fills the input field.
- **Voice + Send** — After transcription, review the text in the input field before hitting Send.
- **Golden Ratio UI** — The input area uses a $1.618$ ratio for nested radii to ensure no text clipping.

---

## ☕ Support

Building and maintaining these tools takes significant time and energy. Your tips keep the caffeine flowing and help deliver high-quality, reliable products for the community.

<p align="left">
  <a href="https://paypal.me/waghmaresujit">
    <img src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" height="36" />
  </a>
  <a href="https://ko-fi.com/sujitwaghmare">
    <img src="https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white" height="36" />
  </a>
  <img src="https://img.shields.io/badge/UPI_(_Scan_Below_)-122E31?style=for-the-badge&logo=upi&logoColor=white" height="36" />
</p>

<details>
<summary><b>Donate via UPI (QR Code)</b></summary>
<br>
<p align="left">
<img src="https://img.shields.io/badge/exotic.sus@axl-122E31?style=for-the-badge&logo=upi&logoColor=white" />
</p>
<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=exotic.sus@axl&pn=Sujit%20Rajabhau%20Waghmare&cu=INR" alt="UPI QR Code" />
</details>

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

---

## 📑 Guide

See [comprehensive guide](https://github.com/sujit-waghmare/gemini-side-panel/blob/82161d07b30673172a1b1886fd5bede3241d846f/assets/Tutorial/Gemini%20in%20Side%20Panel.md) for full details.

---

## 📄 License

[MIT](LICENSE) © 2026 [Waghmare](https://github.com/sujit-waghmare)
