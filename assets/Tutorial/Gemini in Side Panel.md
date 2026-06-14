# Gemini Side Panel — Complete 1:1 Tutorial

---

<img src="https://img.shields.io/github/v/release/sujit-waghmare/gemini-side-panel?color=blue&style=flat-square" /><br><img src="https://img.shields.io/badge/Obsidian-v0.15.0+-purple?style=flat-square" /><br><img src="https://img.shields.io/badge/License-All_Rights_Reserved-red?style=flat-square" /><br><img src="https://img.shields.io/badge/Mobile%20Friendly-Yes-brightgreen?style=flat-square" />

---

## Table of Contents

- Prerequisites
- Get Your Gemini API Key
- Get Your Sarvam API Key (Voice)
- Installation
- Settings
- Using the Panel
- Voice Input (Sarvam)
- Custom Note as Template
- Testing
- Troubleshooting
- Pro Tips
- Reference Card
- File Reference
- FAQ

---

## STEP 1: Prerequisites

Before anything, make sure you have:

1. **Obsidian** installed — Desktop or Mobile. Download from [obsidian.md](https://obsidian.md).
2. **A Vault** created in Obsidian.
3. **Community Plugins enabled** — Restricted Mode must be OFF.

To enable Community Plugins:
> Obsidian → Settings → Community Plugins → Turn off Restricted Mode

---

## STEP 2: Get Your Gemini API Key

The plugin requires a free API key from Google. Here is exactly how to get one:

### 2.1 — Go to Google AI Studio

1. Open your browser and go to [https://aistudio.google.com/](https://aistudio.google.com/).
2. Sign in with your Google account.

### 2.2 — Create an API Key

1. In the left sidebar, click **"Get API key"**.
2. Click **"Create API key"**.
3. Choose **"Create API key in new project"** (recommended) or select an existing project.
4. Your key will be generated — it looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX`

### 2.3 — Copy and Save It

> Important
> Copy your API key immediately and store it somewhere safe (e.g. a private note). You cannot view the full key again after leaving the page.

### 2.4 — Free Tier Limits

- The free tier is sufficient for personal use.
- No credit card is required.
- Rate limits apply (requests per minute), but are generous for single-user use.

---

## STEP 3: Get Your Sarvam API Key (Voice Input)

Sarvam AI powers the 🎤 voice transcription feature. It supports **English, Hindi, and 10 other Indic languages** — all from the same endpoint, auto-detected.

> This step is **optional**. Skip it if you don't need voice input. The plugin works fully without it.

### 3.1 — Go to Sarvam AI Dashboard

1. Open your browser and go to [https://dashboard.sarvam.ai](https://dashboard.sarvam.ai).
2. Sign up with your email or Google account.

### 3.2 — Create an API Key

1. After logging in, go to **API Keys** in the sidebar.
2. Click **"Create new key"** (or similar — the UI may vary slightly).
3. Give it a name like `obsidian-plugin`.
4. Copy the key — it looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 3.3 — Free Tier Limits

- Sarvam's free tier includes a generous credit allowance for personal use.
- No credit card required to get started.
- Each transcription call uses a few credits depending on audio length.
- REST API supports audio up to **30 seconds per request**.

### 3.4 — Supported Languages

Sarvam's `saaras:v3` model auto-detects the language in your audio. No config needed.

| Language | Code |
|---|---|
| English (Indian accent) | `en-IN` |
| Hindi | `hi-IN` |
| Bengali | `bn-IN` |
| Tamil | `ta-IN` |
| Telugu | `te-IN` |
| Kannada | `kn-IN` |
| Malayalam | `ml-IN` |
| Marathi | `mr-IN` |
| Gujarati | `gu-IN` |
| Punjabi | `pa-IN` |
| Odia | `od-IN` |

> You can mix languages mid-sentence (code-mixing) — `saaras:v3` handles it.

### 3.5 — Add Key to Plugin

1. Go to **Settings → Gemini Side Panel → Voice Transcription**.
2. Paste your Sarvam key in the **Sarvam API Key** field.
3. The 🎤 button will appear immediately in the chat panel — no restart needed.

---

## STEP 4: Manual Installation

Since this plugin is not on the Obsidian community store yet, install it manually.

### Folder structure you need:

```
YourVault/
└── .obsidian/
    └── plugins/
        └── gemini-side-panel/
            ├── main.js
            ├── manifest.json
            └── styles.css
```

### Steps:

1. Open your vault folder on your computer or mobile.
   - **Windows:** Right-click vault in Obsidian → "Show in Explorer"
   - **Mac/Linux:** Right-click vault → "Reveal in Finder / File Manager"
   - **Mobile:** Navigate to your vault folder using a file manager app

   > [!warning] I don't see a `.obsidian` folder
   > Go to your file manager settings and enable **"Show hidden files"**. The `.obsidian` folder is hidden by default.

2. Navigate to `.obsidian/plugins/`.
   - If the `plugins/` folder doesn't exist, create it manually.

3. Create a new folder named **exactly**: `gemini-side-panel`

4. Place `main.js`, `manifest.json`, and `styles.css` inside it.
   - Get these files from the [GitHub releases page](https://github.com/sujit-waghmare/gemini-side-panel/releases).

5. Open Obsidian.

6. Go to **Settings → Community Plugins**.

7. Click the **Refresh** button (circular arrow icon).

8. Find **"Gemini Side Panel"** in the list.

9. Toggle it **ON**.

✅ Plugin is now installed and active.

---

## STEP 5: Plugin Settings

Go to:
> Settings → (scroll down) → Gemini Side Panel

You will see five sections:

### 🔑 Section 1: API Configuration

- **Gemini API Key** — Paste your key from [[#STEP 2 Get Your Gemini API Key|Step 2]] here. No trailing spaces.
- **Model** — Choose which Gemini model to use by default.

| Model | Best For |
|---|---|
| Gemini 3.1 Pro | Advanced reasoning, complex questions |
| Gemini 3 Flash | Fast responses, frontier tasks |
| Gemini 3.1 Flash-Lite | High-volume, lightweight use |
| Gemini 2.5 Pro | Balanced quality and speed |
| Gemini 2.5 Flash | **Default.** General everyday use |
| Gemini 2.5 Flash-Lite | Minimal resource usage |

### 🎤 Section 2: Voice Transcription

- **Sarvam API Key** — Paste your key from [[#STEP 3 Get Your Sarvam API Key Voice|Step 3]] here. Stored as password (hidden by default).
- Once a valid key is saved, the 🎤 button appears in the chat panel automatically.
- Leave blank to hide the voice button and skip voice features entirely.

### 🌡️ Section 3: AI Behavior

- **Temperature Slider** — Controls how strictly Gemini follows your selected source.

| Value | Behavior |
|---|---|
| `1.0` | Strict — answers only from Note or Internet, no mixing |
| `0.5` | Flexible — uses source as reference, fills gaps intelligently |

> Recommendation
> Keep at `1.0` for study/research notes. Drop to `0.7` for creative or exploratory chats.

### 🔢 Section 4: History Settings

- **Enable Chat History** — Off by default. Toggle ON to save each note's chat separately.
- **Retention Limit** — Choose between:
  - `Days` — Auto-deletes messages older than X days
  - `Queries` — Keeps only the last X question-answer pairs
- **Limit Value** — Enter the number (e.g. `7` for 7 days, or `10` for 10 query pairs).

> How history works
> Each note stores its own independent chat history. Opening Note A shows Note A's chat. Opening Note B shows a clean slate (or Note B's own history if it has one).

### 📝 Section 5: Template Configuration

This is where you register your custom `.md` notes as response templates.

- Click **"Add Template"** to create a new entry.
- Fill in two fields:
  - **Display Name** — What appears in the chat menu (e.g. `Physics Layout`)
  - **File Path** — Path to your template note in the vault (e.g. `Templates/Physics.md`)
- The `.md` extension is auto-added if you forget it.
- Click the 🗑️ trash icon to remove a template entry.

> See `Step 8` for a full walkthrough of creating and using templates.

---

## STEP 6: Using the Gemini Side Panel

### 6.1 — Opening the Chat Panel

Three ways to open it:

| Method | How |
|---|---|
| **Ribbon Icon** | Click the 🤖 bot icon in the left ribbon |
| **Command Palette** | `Ctrl/Cmd + P` → type `Open Gemini in right panel` or `left panel` |
| **Selection Mode** | Highlight text in a note → open via Command Palette → text pre-fills the input |

### 6.2 — The Chat Interface

Once open, you will see:

- **Chat history area** — All messages appear here, rendered as Markdown.
- **Input field** — Type your question. Press `Enter` for a new line. Click **Send** to submit.
- **Send button** — Submits your message.
- **🎤 Voice button** — Hold to record, release to transcribe. Only visible if Sarvam key is set.
- **Menu icon** (☰) — Opens the floating settings dropdown.

### 6.3 — The Dropdown Menu

Click the **☰ Menu icon** to open it. It has four accordion sections:

#### Model
> Collapsed by default. Expand to switch the active Gemini model on the fly without going to settings.

| Option | Description |
|---|---|
| 3.1 Pro | Advanced thinking |
| 3 Flash | Fast & frontier |
| 3.1 Flash-Lite | High volume |
| 2.5 Pro | Balanced |
| 2.5 Flash | Default |
| 2.5 Flash-Lite | Lightweight |

#### Source
Controls what Gemini uses to answer your question.

| Option | What it does |
|---|---|
| **Note** | Strictly reads your current open note only. Refuses to use outside knowledge. |
| **Internet** | Uses Gemini's full training data and general knowledge. Note is background context only. |

> [!tip] Use Note mode for studying. Use Internet mode for research or open-ended questions.

#### Format
Controls how Gemini structures its reply.

| Option | Output Style |
|---|---|
| **Better Visuals** | Bold headings, tables, bullet lists |
| **Better Understanding** | Deep analogies, concept explanations |
| **Brief Information** | Extremely concise, no fluff |

> [!note] Selecting a Template in the next section will override and disable Format automatically.

#### Templates
Lists all templates you configured in [[#STEP 5 Plugin Settings|Settings → Template Configuration]].

- **None** — No template active; Format rules apply normally.
- **Your custom templates** — Selecting one forces Gemini to mirror that note's exact structure.

### 6.4 — Copying a Response

- **Long-press** (hold 600ms) any Gemini response bubble to copy its full contents.
- A **"Copied!"** notice confirms the action.
- Works on both desktop (hold click) and mobile (hold tap).

### 6.5 — Clearing Chat History

- Run Command Palette → **"Clear Gemini chat history"**
- This clears only the **currently active note's** history.
- Other notes' histories remain untouched.

### 6.6 — LaTeX Math Support

The panel renders LaTeX math automatically.

| Syntax | Result |
|---|---|
| `$E = mc^2$` | Inline math |
| `$$\int_0^\infty f(x)dx$$` | Display/block math |

Just ask a math question and Gemini will output LaTeX, which the panel renders automatically.

---

## STEP 7: Voice Input (Sarvam AI)

> Requires a Sarvam API key set in Settings → Voice Transcription. See [[#STEP 3 Get Your Sarvam API Key Voice|Step 3]].

### 7.1 — How It Works

The 🎤 button captures audio directly from your microphone, sends it to Sarvam's `saaras:v3` speech-to-text API, and pastes the transcript into the input field. You then review and hit **Send** — the transcript is never auto-sent.

### 7.2 — Recording a Message

1. Make sure the 🎤 button is visible in the action row (requires Sarvam key).
2. **Hold** the 🎤 button.
   - Button turns **red** with a pulse animation — recording has started.
   - The mic icon changes to `mic-off` to confirm active state.
3. **Speak** your message clearly (up to ~25 seconds to stay under the 30s API limit).
4. **Release** the button.
   - `🎤 Transcribing...` appears in the chat area while the API processes.
   - Transcript is pasted into the input field automatically.
5. **Review** the text, edit if needed, then click **Send**.

> A notice like `Transcribed (hi-IN)` confirms success and shows the detected language.

### 7.3 — Audio Format Compatibility

The plugin auto-selects the best supported audio format for your browser/device:

| Priority | Format | Codec |
|---|---|---|
| 1st choice | WebM | Opus |
| 2nd choice | WebM | — |
| 3rd choice | OGG | Opus |
| 4th choice | MP4 | — |

No manual configuration needed. Works on all major desktop and mobile platforms.

> [!note] The plugin strips codec suffixes (e.g. `codecs=opus`) from the Content-Type header before sending to Sarvam. This prevents API rejection on some platforms.

### 7.4 — Language Detection

You do not set a language. Sarvam auto-detects it from the audio. Supported languages:

- English (Indian accent), Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Odia.
- Mixed-language speech (code-switching between English and Hindi, etc.) is handled well.

### 7.5 — Voice Tips

- Speak at a **normal pace** — no need to slow down.
- Works best with **clear audio** and minimal background noise.
- For **longer thoughts**, break into multiple recordings rather than one 30-second clip.
- Voice transcript is **editable before sending** — correct any mis-transcriptions freely.
- Works on **mobile** too — hold the button with your thumb, release when done.

### 7.6 — When the Voice Button Doesn't Appear

The voice button is hidden by default and appears only when a Sarvam API key is present.

1. Go to **Settings → Voice Transcription → Sarvam API Key**.
2. Paste your key and press Tab or click away to save.
3. The button appears **instantly** in any open panel — no restart required.

---

## STEP 8: Custom Note as Template

This is the most powerful feature. You can force Gemini to reply in the **exact structure of any `.md` note** in your vault.

### 8.1 — What a Template Does

When you select a template, the plugin:
1. Reads the full content of your chosen `.md` note.
2. Passes it to Gemini with a **CRITICAL RULE** instruction: *"Mirror this exact structure."*
3. Gemini's reply will follow the headings, bullet style, table layout, and formatting of your template — applied to your actual question.

### 8.2 — Create a Template Note

First, create the `.md` note that will serve as your structure blueprint.

**Example — Physics Answer Layout:**

Create a note at `Templates/Physics.md` with this content:

```markdown
## Topic
[Topic name here]

## Core Concept
[One-sentence definition]

## Key Formula
| Symbol | Meaning |
|---|---|
|  |  |

$$
[Main formula here]
$$

## Step-by-Step Explanation
1. 
2. 
3. 

## Real-World Example
> [Practical application]

## Common Mistakes
- 
- 

## Summary
[2-3 sentence recap]
```

This is your layout. Gemini will fill in every section based on whatever question you ask.

### 8.3 — Register the Template in Settings

1. Go to **Settings → Gemini Side Panel → Template Configuration**.
2. Click **"Add Template"**.
3. Fill in:
   - **Display Name:** `Physics Layout`
   - **File Path:** `Templates/Physics`  *(`.md` is added automatically)*
4. The template now appears in your chat menu.

### 8.4 — Use the Template in Chat

1. Open the note you want to ask about (or any note).
2. Open the Gemini panel.
3. Click the **☰ Menu** icon.
4. Expand **Templates** → select `Physics Layout`.
   - Notice: Format section auto-sets to `None`. This is correct.
5. Type your question, e.g.: `Explain Newton's Second Law`
6. Click **Send**.

Gemini will reply using **your exact template structure** — with Topic, Core Concept, Key Formula, Steps, Example, Mistakes, and Summary all filled in.

### 8.5 — Template Rules and Behaviour

| Behaviour | Detail |
|---|---|
| Format auto-clears | Selecting a template sets Format to `None` |
| Format clears template | Selecting a Format (Visuals/etc.) clears the active template |
| They are mutually exclusive | You can use one or the other, never both |
| Path is case-sensitive | `Templates/Physics.md` ≠ `templates/physics.md` |
| `.md` is optional | Plugin appends it automatically if missing |
| Invalid path = instant error | Bot replies with ⚠️ error without calling the API |

### 8.6 — More Template Ideas

| Template Name | Use Case | What to put in it |
|---|---|---|
| `Lecture Notes` | Structure Gemini answers like your class notes | Headings: Intro, Theory, Examples, Questions |
| `Book Summary` | Summarise chapters consistently | Sections: Overview, Key Ideas, Quotes, My Take |
| `Code Review` | Get structured code feedback | Sections: What it does, Issues, Suggestions, Refactored version |
| `Study Card` | Flashcard-style output | Front, Back, Related Concepts, Memory Hook |
| `Research Brief` | Structured research answers | Background, Evidence, Gaps, Conclusion |

### 8.7 — Using Source + Template Together

Templates work with both Source modes:

- **Note + Template** — Gemini reads your current note, then answers in your template's structure. Great for summarising and restructuring your own notes.
- **Internet + Template** — Gemini pulls from its full knowledge, then formats it using your template. Great for researching new topics in your own layout.

---

## STEP 9: Testing It Works

Follow this exact sequence:

1. **Template Test**
   - Select a custom template from the dropdown menu.
   - Confirm Format shows as `None`.
   - Send any question.
   - Verify the reply matches your template's heading structure exactly.

2. **Note History Test**
   - Enable history in Settings.
   - Open Note A and send a message.
   - Switch to Note B — chat area should be empty.
   - Switch back to Note A — your previous chat should reappear.

3. **Invalid Template Test**
   - In Settings, add a template with a fake path: `DoesNotExist/Fake`.
   - Select it in the menu.
   - Send a message.
   - Bot should immediately reply with `⚠️ Error: Could not find template file...` without calling the API.

4. **Source Test**
   - Open any note with content.
   - Set Source to **Note**, ask about something NOT in the note.
   - Gemini should say: `"I cannot find that in this note."`
   - Switch to **Internet**, ask the same question — it should answer fully.

5. **Voice Test** *(requires Sarvam key)*
   - Confirm the 🎤 button is visible.
   - Hold it, say a short sentence (English or Hindi), release.
   - `🎤 Transcribing...` should briefly appear.
   - Transcript should appear in the input field.
   - A notice like `Transcribed (en-IN)` should confirm success.

---

## Troubleshooting

<details>
<summary><strong>API Key missing! notice appears</strong></summary>

1. Go to **Settings → Gemini Side Panel → Gemini API Key**.
2. Paste your key again. Make sure there are no trailing spaces or newlines.
3. Confirm you saved by closing and reopening settings.
4. Verify the key is valid at [aistudio.google.com](https://aistudio.google.com) — test it there directly.
</details>

<details>
<summary><strong>Could not find template file error</strong></summary>

1. Check **Settings → Template Configuration**.
2. Path is **case-sensitive**: `Templates/Physics.md` ≠ `templates/physics.md`.
3. Make sure the file actually exists in your vault at that exact path.
4. Try adding `.md` explicitly even though it's auto-appended — occasionally helps on mobile.
5. Open the note directly in Obsidian, right-click → "Copy Obsidian URL", then extract the path from it.
</details>

<details>
<summary><strong>Failed to load plugin</strong></summary>

1. Confirm all three files exist: `main.js`, `manifest.json`, `styles.css`.
2. Folder must be named exactly: `gemini-side-panel` (no spaces, no capitals).
3. Check for settings corruption: open `.obsidian/plugins/gemini-side-panel/data.json` and verify it is valid JSON (or delete it to reset settings — your API key will be wiped so save it first).
4. After placing files, always click **Refresh** in Settings → Community Plugins before enabling.
</details>

<details>
<summary><strong>Connection failed / API not responding</strong></summary>

1. Check your internet connection.
2. Visit [Google AI Studio](https://aistudio.google.com/) to confirm your API key is active and not expired.
3. Free tier may hit rate limits — wait 60 seconds and retry.
4. If you're on a VPN or restrictive network, the Gemini API endpoint (`generativelanguage.googleapis.com`) may be blocked.
</details>

<details>
<summary><strong>Gemini ignores my template structure</strong></summary>

1. Confirm Template is selected (not Format) in the dropdown.
2. Format should show as `None` when a template is active.
3. Increase Temperature to `1.0` — lower temperatures make the model less strict about following rules.
4. Make your template more explicit: add placeholder text like `[Fill this section]` in each section.
5. Avoid very short templates — Gemini needs enough structure to understand your intent.
</details>

<details>
<summary><strong>Chat history not saving</strong></summary>

1. Go to **Settings → History Settings → Enable Chat History** — toggle it ON.
2. History is per-note. Make sure you have a note open (not an empty workspace).
3. If the vault is in a read-only location on mobile, `data.json` may fail to write — move the vault to writable storage.
</details>

<details>
<summary><strong>🎤 Voice button not showing</strong></summary>

1. Go to **Settings → Voice Transcription → Sarvam API Key**.
2. Paste your Sarvam key and click away to save. The button appears instantly.
3. If you added the key but the button still doesn't show: close and reopen the panel from the ribbon.
4. Confirm there are no extra spaces at the start or end of the key.
</details>

<details>
<summary><strong>Mic access denied</strong></summary>

**Desktop (Windows/Mac/Linux):**
1. Check OS-level microphone permissions for the Obsidian app.
2. Windows: Settings → Privacy → Microphone → allow Obsidian.
3. Mac: System Settings → Privacy & Security → Microphone → allow Obsidian.

**Mobile (Android/iOS):**
1. Go to your device Settings → Apps → Obsidian → Permissions → Microphone → Allow.
2. On iOS, you may see a permission popup on first use — tap **Allow**.
</details>

<details>
<summary><strong>Sarvam error 422 / Unprocessable Entity</strong></summary>

1. Audio is too long — keep recordings under **25 seconds** to stay safely under Sarvam's 30s limit.
2. Audio format may be unsupported on your device — try a different browser or update Obsidian.
3. File size too large — recording at a lower quality isn't configurable, but shorter clips help.
4. Check your Sarvam dashboard for remaining credits — if credits are exhausted, all requests return 422.
</details>

<details>
<summary><strong>Sarvam error 401 / 403 — Authentication failed</strong></summary>

1. Go to **Settings → Voice Transcription → Sarvam API Key** and re-enter your key.
2. Verify the key is correct at [dashboard.sarvam.ai](https://dashboard.sarvam.ai) — generate a new one if needed.
3. The key field is type `password` so the value is hidden — double-check by deleting and re-pasting.
</details>

<details>
<summary><strong>Transcript is empty or "No transcript returned"</strong></summary>

1. Make sure you actually spoke clearly into the mic during the hold.
2. Background noise may have drowned out the speech — try in a quieter environment.
3. Sarvam returned a 200 but empty transcript — this can happen with very short or silent recordings. Speak for at least 1–2 seconds.
4. Check the Sarvam dashboard to confirm the API call registered (it will show in your usage logs).
</details>

<details>
<summary><strong>Transcription is in the wrong language</strong></summary>

`saaras:v3` auto-detects language from audio — there is no language setting to change. If it keeps misdetecting:
1. Speak more slowly and clearly for the first few words to anchor the detection.
2. For pure English, avoid mixing too many Indian words in the opening phrase.
3. For Hindi, start the recording with a clear Hindi phrase rather than an English word.
</details>

<details>
<summary><strong>🎤 button disappears after restarting Obsidian</strong></summary>

1. The button visibility is controlled by whether a Sarvam key is set in `data.json`.
2. If the key is gone after restart, `data.json` may have been reset — re-enter the key.
3. This can happen if settings failed to save (write permission issue on mobile).
</details>

---

## Pro Tips

- **Selection Mode** — Highlight a paragraph in any note, then open the panel via Command Palette. The selected text pre-fills the input. Great for asking about a specific section.
- **Voice + Note Source** — Use voice to dictate a question, then send it with Source = Note. Hands-free study assistant.
- **Voice for Hindi** — Works natively for Hindi and all major Indic languages. No extra config — just speak and release.
- **Theme Sync** — Chat bubbles and menus inherit your Obsidian accent color automatically via `--interactive-accent`. Change your theme and the panel follows.
- **Golden Ratio Input** — The input area uses a $1.618$ nested radius ratio, preventing text clipping on any screen size.
- **Model on the fly** — Switch models mid-conversation in the dropdown without going to settings. Useful for switching from Flash (fast draft) to Pro (deep analysis) on the same note.
- **Clear only what you need** — `Clear Gemini chat history` only wipes the active note. All other notes keep their history intact.
- **Template + Note Source combo** — The most powerful combo: Source = Note, Template = your layout. Gemini reads your note and outputs a perfectly structured answer in your format.
- **Brief for quick lookups** — Set Format to `Brief Information` when you just need a one-liner fact. No need to switch models.
- **Review before sending** — Voice transcript lands in the input field unedited. Always review before hitting Send — Sarvam is accurate but not perfect.

---

## Quick Reference Card

| What you want | How to do it |
|---|---|
| Open the panel | Click 🤖 ribbon icon, or `Ctrl+P` → `Open Gemini` |
| Open on left side | `Ctrl+P` → `Open Gemini in left panel` |
| Pre-fill with selected text | Highlight text → `Ctrl+P` → `Open Gemini` |
| Switch AI model | Menu ☰ → Model → pick one |
| Answer from note only | Menu ☰ → Source → Note |
| Answer from internet | Menu ☰ → Source → Internet |
| Use visual formatting | Menu ☰ → Format → Better Visuals |
| Use a template | Menu ☰ → Templates → select your template |
| Remove active template | Menu ☰ → Templates → None |
| Copy a response | Long-press (600ms hold) any bot bubble |
| Voice input | Hold 🎤, speak, release |
| Clear this note's chat | `Ctrl+P` → `Clear Gemini chat history` |
| Adjust strictness | Settings → AI Behavior → Temperature slider |
| Add a new template | Settings → Template Configuration → Add Template |
| Enable voice | Settings → Voice Transcription → paste Sarvam key |

---

## File Reference

| File | Purpose | Edit? |
|---|---|---|
| `manifest.json` | Plugin ID, versioning, Obsidian compatibility | ❌ No |
| `main.js` | All logic: chat, API calls, voice, templates, history, settings | ❌ No |
| `styles.css` | All visual styles for the panel | ❌ No |

*Plugin version: 1.4.0 — Compatible with Obsidian 0.15.0 and above*

### manifest.json
```json
{
    "id": "gemini-side-panel",
    "name": "Gemini Side Panel",
    "version": "1.4.0",
    "minAppVersion": "0.15.0",
    "description": "Side-panel chat for Gemini with note-specific history, temperature control, custom template referencing, and Sarvam AI voice transcription.",
    "author": "Waghmare",
    "authorUrl": "https://github.com/sujit-waghmare",
    "fundingUrl": "https://paypal.me/waghmaresujit",
    "isDesktopOnly": false
}
```

---

## FAQ

<details>
<summary><strong>Q: Is this plugin free?</strong></summary>

Yes. The plugin itself is free. You need a free Gemini API key from Google AI Studio. Voice input additionally requires a free Sarvam API key — both have free tiers with no credit card required.
</details>

<details>
<summary><strong>Q: Does it work on mobile?</strong></summary>

Yes. Both Android and iOS are supported. Install by placing the files in your vault's `.obsidian/plugins/gemini-side-panel/` folder. Voice input works on mobile too — hold the mic button with your thumb.
</details>

<details>
<summary><strong>Q: Can I use multiple templates?</strong></summary>

Yes. Add as many as you like in Settings → Template Configuration. Only one can be active at a time in the chat.
</details>

<details>
<summary><strong>Q: Will Gemini always follow my template structure?</strong></summary>

It strongly enforces it via a `CRITICAL RULE` prompt. Occasionally complex questions may deviate slightly. Setting temperature to `1.0` improves compliance. Making placeholder text more explicit in the template also helps.
</details>

<details>
<summary><strong>Q: Does the plugin send my notes to Google?</strong></summary>

Only when Source is set to **Note** and you send a message. The current note's content is sent to the Gemini API as context. No data is stored by the plugin itself — it all goes through Google's API.
</details>

<details>
<summary><strong>Q: Does voice input send audio to a third party?</strong></summary>

Yes. When you use the 🎤 button, your audio is sent to Sarvam AI's servers (`api.sarvam.ai`) for transcription. Sarvam's privacy policy applies. The plugin does not store the audio — it is sent directly and discarded after transcription.
</details>

<details>
<summary><strong>Q: What is the difference between Note and Internet mode?</strong></summary>

Note mode locks Gemini to your note's content only — it will refuse to answer anything not in the note. Internet mode uses Gemini's full knowledge; your note is background context only.
</details>

<details>
<summary><strong>Q: Can I use LaTeX in my questions?</strong></summary>

Yes. Type `$...$` for inline or `$$...$$` for block math. Gemini will also output LaTeX in its responses, which the panel renders automatically.
</details>

<details>
<summary><strong>Q: Where is chat history stored?</strong></summary>

Locally inside your vault, in `.obsidian/plugins/gemini-side-panel/data.json`. It never leaves your device unless you send a message (which includes recent context as part of the Gemini API call).
</details>

<details>
<summary><strong>Q: Can I use a template note that has images or embeds?</strong></summary>

The plugin reads raw Markdown text. Images and embeds won't be sent to Gemini, but the heading and text structure will be enforced correctly.
</details>

<details>
<summary><strong>Q: The model section is collapsed by default — why?</strong></summary>

Model switching is less frequent. It defaults to collapsed to keep the menu clean. Expand it anytime to switch models mid-chat.
</details>

<details>
<summary><strong>Q: Can I dictate in Hindi and have Gemini reply in English?</strong></summary>

Yes. Dictate in Hindi using the voice button (transcript will be in Hindi). Then set Source to Internet and send. Gemini will understand the Hindi question and reply in English by default. If you want a Hindi reply, add "Reply in Hindi" at the end of your message.
</details>

<details>
<summary><strong>Q: Is there a word limit for voice transcription?</strong></summary>

The Sarvam REST API accepts audio up to **30 seconds per request**. For longer inputs, break your recording into multiple shorter clips. Each clip is transcribed and appended to the input field separately.
</details>

<details>
<summary><strong>Q: What happens if I run out of Sarvam credits?</strong></summary>

The API will return an error and a notice will appear. The input field will remain empty. Your Gemini chat still works normally — only voice transcription is affected. Top up credits at [dashboard.sarvam.ai](https://dashboard.sarvam.ai).
</details>

<details>
<summary><strong>Q: Can I use voice input without the internet?</strong></summary>

No. Both Gemini and Sarvam require active internet connections. The plugin does not support offline use.
</details>

<details>
<summary><strong>Q: Does voice work in all languages or just Indian ones?</strong></summary>

`saaras:v3` is optimized for Indian languages and English with an Indian accent. It may handle other accents of English reasonably well, but non-Indian languages (French, Spanish, etc.) are not officially supported by this model.
</details>
